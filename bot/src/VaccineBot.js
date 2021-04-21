const VaccineScraper = require('./VaccineScraper');

class VaccineBot {
    constructor() {
        this.scraper = new VaccineScraper();
    }

    async sendAppointmentTextMessages() {
        // get available appointments
        const availableAppointments = this.scraper.getAvaiableAllApointments(); 

        // get users from db that are waiting for vaccine

        // compare users specified time against vaccine appointments

        // send texts to matches found
    }

    // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = VaccineBot;