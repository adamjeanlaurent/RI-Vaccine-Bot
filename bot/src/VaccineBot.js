const VaccineScraper = require('./VaccineScraper');
const connection = require('./connection');

class VaccineBot {
    constructor() {
        this.scraper = new VaccineScraper();
    }

    async getUncompletedTasks() {
        const [rows, fields] = await connection.execute(
            // get the tasks in reverse order 
            // because we process the tasks in a queue
            // the lower taskIDs will be processed first 
            // because they signed up first
            'SELECT * FROM task WHERE completed = 0 ORDER BY taskID DESC'
        );
        return rows;
    }

    async processTaskQueue(taskQueue, appointmentsMap) {
        // matches tasks against avaiblable appoints (using unknown alorithm as this time) 
        // and helper doesAppointmentMatchPreferences
        // after the matching process, uses sendTextMessage in a loop to send text messages to users

        const matchingAppointments = [];

        for(let i = 0; i < taskQueue.length; i++) {
            if(appointmentsMap.has(taskQueue[i].date_picked)) {
                // if there are appointments any at this date

                // get appointments at the date the user wants
                const appointments = appointmentsMap.get(taskQueue[i].date_picked);

                // search appointments at that date for an appointment that falls into
                // the tasks time start and end
                for(let j = 0; j < appointments.length; j++) {
                    // check if appointment and tasks's times agrees
                    if(this.doTimesMatch(appointments[j], taskQueue[i])) {
                        // matching appointment
                        // create new matching appointment
                        // has information to send full text message
                        matchingAppointments.push({
                            time: appointments[j].time,
                            location: appointments[j].location,
                            link: appointments[j].link,
                            date: appointments[j].date,
                            firstname: taskQueue[i].f_name,
                            lastname: taskQueue[i].l_name,
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
    }

    async doTimesMatch(appointment, preferences) {
        // takes in an appointment
        // and the prefernces of a task
        // returns true if the times line up
        // returns false if they do not

        const { time_start, time_end } = preferences;
        const { time } = appointment;

        
        // figure out how to parse SQL date and time
    }

    async sendTextMessages(matchingAppointments) {
        // sends text messages with the detials of an appointments
        // marks tasks in db as completed
    }

    async run() {
        // get available appointments
        const availableAppointments = await this.scraper.getAvaiableAllApointments();

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

        // get users from db that are waiting for vaccine
        const taskQueue = await this.getUncompletedTasks();

        // process task queue, get appointments and tasks that matchup
        const matchingAppointments = await this.processTaskQueue(taskQueue, appointmentsMap);

        // send texts
        await this.sendTextMessages(matchingAppointments);
    }

    // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = VaccineBot;