const VaccineScraper = require('./VaccineScraper');

const scraper = new VaccineScraper();

const testRegistrationLinks = async() => {
    const links = await scraper.getRegistrationLinks();
    console.log(links);
}

const testValidAppointments = async() => {
    const appointments = await scraper.getAvaiableAllApointments();
    console.log(appointments);
}

testValidAppointments();
// testRegistrationLinks();