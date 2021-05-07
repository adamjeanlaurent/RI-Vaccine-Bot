const VaccineScraper = require('./VaccineScraper');
const connection = require('./connection');
const { yyyymmddTommddyyyy, getHoursMinutesSeconds } = require('./date');
const sendEmail = require('./email');
const colors = require('colors');

const dotenv = require('dotenv');
dotenv.config();

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = require('twilio')(accountSid, authToken);

class VaccineBot {
    constructor(debug) {
        this.scraper = new VaccineScraper();
        this.debug = debug;
    }

    async getUncompletedTasks() {
        const [rows, fields] = await connection.execute(
            // get the tasks in reverse order 
            // because we process the tasks in a queue
            // the lower taskIDs will be processed first 
            // because they signed up first
            'SELECT * FROM task WHERE completed = 0 ORDER BY taskID ASC'
        );
        return rows;
    }

    async processTaskQueue(taskQueue, appointmentsMap) {
        // matches tasks against avaiblable appoints (using unknown alorithm as this time) 
        // and helper doesAppointmentMatchPreferences
        // after the matching process, uses sendTextMessage in a loop to send text messages to users
        if(this.debug) console.log(`processing task queue`);

        const matchingAppointments = [];

        for(let i = 0; i < taskQueue.length; i++) {
            if(this.debug) console.log(`original date ${taskQueue[i].date_picked}`);
            let convertedDate = yyyymmddTommddyyyy(taskQueue[i].date_picked);
            if(this.debug) console.log(`converted date: ${convertedDate}`);
            if(appointmentsMap.has(convertedDate)) {
                // if there are appointments any at this date

                // get appointments at the date the user wants
                const appointments = appointmentsMap.get(convertedDate);

                // search appointments at that date for an appointment that falls into
                // the tasks time start and end
                for(let j = 0; j < appointments.length; j++) {
                    // check if appointment and tasks's times agrees
                    if(this.doTimesMatch(appointments[j], taskQueue[i])) { 
                        // matching appointment
                        // create new matching appointment
                        // has information to send full text message
                        matchingAppointments.push({
                            taskID: taskQueue[i].taskID,
                            time: appointments[j].time,
                            location: appointments[j].location,
                            link: appointments[j].link,
                            date: appointments[j].date,
                            firstname: taskQueue[i].f_name,
                            lastname: taskQueue[i].l_name,
                            userID: taskQueue[i].userID
                        });
                        
                        // remove 1 from number of vaccines left for appointment slot
                        appointments[j].numLeft--;
                        if(appointments[j].numLeft <= 0) {
                            // if no more vaccines available for this appointment slot
                            // remove appointment slot from list of appointments avaialble
                            appointments.splice(j, 1);
                        }
                       
                        break;
                    }
                }
            }
        }
        return matchingAppointments;
    }

    doTimesMatch(appointment, task) {
        // takes in an appointment
        // and the prefernces of a task
        // returns true if the times line up
        // returns false if they do not
        // assume dates are the same if we arrived here

        // get hours, miunutes, seconds for all times
        const HMSAppointment = getHoursMinutesSeconds(appointment.time);
        const HMSStart = getHoursMinutesSeconds(task.start_time);
        const HMSEnd = getHoursMinutesSeconds(task.end_time);

        // mm/dd/yyyy
        const dateSplit = appointment.date.split('/');
        
        // extract information from times and use in date constructor
        // new Date(year, month, day, hours, minutes, seconds, milliseconds)
        const startDate = new Date(
            parseInt(dateSplit[2]), // year
            parseInt(dateSplit[1]) - 1, // month
            parseInt(dateSplit[0]), // day
            HMSStart.hours, // hours
            HMSStart.minutes, // minutes
            HMSStart.seconds // seconds
        );
        const endDate = new Date(
            parseInt(dateSplit[2]), // year
            parseInt(dateSplit[1]) - 1, // month
            parseInt(dateSplit[0]), // day
            HMSEnd.hours, // hours
            HMSEnd.minutes, // minutes
            HMSEnd.seconds // seconds
        );
        const appointmentDate = new Date(
            parseInt(dateSplit[2]), // year
            parseInt(dateSplit[1]) - 1, // month
            parseInt(dateSplit[0]), // day
            HMSAppointment.hours, // hours
            HMSAppointment.minutes, // minutes
            HMSAppointment.seconds // seconds
        );

        // https://stackoverflow.com/questions/16080378/check-if-one-date-is-between-two-dates
        return (appointmentDate >= startDate && appointmentDate <= endDate);
    }

    async sendAlerts(matchingAppointments) {
        // sends text messages and emails with the detials of an appointments
        // marks tasks in db as completed
        const senderPhoneNum = process.env.TWILIO_NUMBER_SENDER;
        const recieverPhoneNum = process.env.TWILIO_NUMBER_RECIPIENT;

        for(let mat of matchingAppointments) {
            // get users email address
            const [rows, fields] = await connection.execute('SELECT * FROM users WHERE userID = ?', [mat.userID]);
            const emailAddress = rows[0].email;

            // let textMessageBody = `Hello ${mat.firstname} ${mat.lastname}\n`;
            // textMessageBody += 'Vaccine Appointment found for you!\n';
            // textMessageBody += `Time: ${mat.time}\n`;
            // textMessageBody += `Date: ${mat.date}\n`;
            // textMessageBody += `Location: ${mat.location}\n`;
            // textMessageBody += `Link to signup: ${mat.link}`;

            let emailMessageBody = `Hello ${mat.firstname} ${mat.lastname} 😃,<br/>`;
            emailMessageBody +=    'Vaccine Appointment found for you in Rhode Island!<br/>';
            emailMessageBody +=    `<b>Time:</b> ${mat.time}<br/>`;
            emailMessageBody +=    `<b>Date:</b> ${mat.date}<br/>`;
            emailMessageBody +=    `<b>Location:</b> ${mat.location}<br/>`;
            emailMessageBody +=    `<b>Link to signup:</b> ${mat.link}`;

            const subject = `Vaccine Appointment Found For You At ${mat.time} - ${mat.date} - ${mat.location} 💉`;
            
            // send text 
            // await client.messages.create({
            //     body: textMessageBody,
            //     from: senderPhoneNum,
            //     to: recieverPhoneNum
            // });

            // send email
            sendEmail(emailAddress, emailMessageBody, subject);

            console.log(colors.green(`email sent to ${emailAddress}`));

            // update task as completed
            await connection.execute(`UPDATE task SET completed = 1 WHERE taskID = ${mat.taskID}`);
        }
    }

    async run() {
        // get users from db that are waiting for vaccine
        const taskQueue = await this.getUncompletedTasks();
        if(this.debug) console.log(`got ${taskQueue.length} uncompleted tasks`);

        if(taskQueue.length === 0) return;

        // get available appointments
        const availableAppointments = await this.scraper.getAllAvaiableApointments();
        if(this.debug) console.log(`got ${availableAppointments.length} available appointments`);

        // convert appointments to map
        // Map<string, VaccineAppointment[]> , string is date of the appointment, and a second arg is array of appointments at that date
        let appointmentsMap = new Map();

        for(let app of availableAppointments) {
            if(appointmentsMap.has(app.date)) {
                appointmentsMap.get(app.date).push(app);
            }
            else {
                appointmentsMap.set(app.date, [ app ]);
            }
        }

        // process task queue, get appointments and tasks that matchup
        const matchingAppointments = await this.processTaskQueue(taskQueue, appointmentsMap);
        if(this.debug) console.log(`got ${matchingAppointments.length} mathing appointments`);

        // send texts and emails
        await this.sendAlerts(matchingAppointments);
    }

    // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = VaccineBot;