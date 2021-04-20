const VaccineBot = require('./src/VaccineBot');

const vaccineBot = new VaccineBot();

while(true) {
    vaccineBot.sendAppointmentTextMessages();
    vaccineBot.sleep(20 * 1000); // sleep for 20 minutes
}