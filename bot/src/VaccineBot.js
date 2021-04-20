// to do:
// - wait function
// - read all users into queue
// - scrape site and check times
// - parse times on page into readable format
// - function to check if parsed time matches user

const VaccineScraper = require('./VaccineScraper');

class VaccineBot {
    constructor() {
        this.scraper = new VaccineScraper();
    }
}

module.exports = VaccineBot;