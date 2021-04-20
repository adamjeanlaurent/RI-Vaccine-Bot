const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const VaccineAppointment = require('./VaccineAppointment');

class VaccineScraper {
    async constructor() {
        this.pages = [
            'https://www.vaccinateri.org/clinic/search?page=1',
            'https://www.vaccinateri.org/clinic/search?page=2',
            'https://www.vaccinateri.org/clinic/search?page=3'
        ];
    }

    async getRegistrationLinks() {
        let registrationLinks = [];
        // check each page
        for(let pageURL of this.pages) {
            // get dom of page
            const dom = await this.getDOM(pageURL);

            // get all button primaries on page
            const buttomPrimaries = dom.querySelectorAll('.button-primary');

            // get only button primaries that are for signing up for a vaccine
            const signupButtons = buttomPrimaries.filter(button => button.text.include('Sign Up for a COVID-19 Vaccination'));

            // push links from buttons onto array
            signupButtons.forEach(button => registrationLinks.push(button.getAttribute('href')));
        }

        return registrationLinks;
    }

    async getAvaiableAllApointments() {
        const registrationLinks = await this.getRegistrationLinks();
        const aviableAppointments = [];

        for(let link of registrationLinks) {
            const dom = await this.getDOM(link);

            
        }
    }

    async getHTML(url) {
        const res = await fetch(url);
        const html = await res.text();
        return html;
    }

    async getDOM(url) {
        const html = await this.getHTML(url);
        const { document } = (new JSDOM(html)).window;
        return document;
    }
}

module.exports = VaccineScraper;