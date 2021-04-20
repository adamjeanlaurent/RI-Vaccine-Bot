const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const VaccineAppointment = require('./VaccineAppointment');

class VaccineScraper {
     constructor() {
        this.baseURL = 'https://www.vaccinateri.org';
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
            const buttonPrimaries = Array.from(dom.querySelectorAll('.button-primary'));

            // get only button primaries that are for signing up for a vaccine
            const signupButtons = buttonPrimaries.filter(button => button.textContent.includes('Sign Up for a COVID-19 Vaccination'));

            // push links from buttons onto array
            signupButtons.forEach(button => registrationLinks.push(this.baseURL + button.getAttribute('href')));
        }

        return registrationLinks;
    }
    
    async getAllAvaiableApointments() {
        const registrationLinks = await this.getRegistrationLinks();
        const availableAppointments = [];

        for(let link of registrationLinks) {
            const validAppointments = await this.getOpenAppointmentsFromLocation(link);
            availableAppointments.push(... validAppointments);
        }

        return availableAppointments;
    }

//     structure of a appointment slots
//     <tr class="bg-gray-200" data-action="click->consent-form-appointments#selectRadioBtn" data-parent="">
//     <td class="flex">
//         <input name="appointment[appointment_at_unix]" type="radio" id="1618941000" value="1618941000" class="form-radio" disabled>

//       <span class="ml-2">05:50 pm</span>
//     </td>

//     <td>
//       <p>
//         No
//         appointments available
//       </p>
//     </td>
//   </tr>

    async getOpenAppointmentsFromLocation(locationLink) {
        let validAppointments = [];

        const dom = await this.getDOM(locationLink);

        // check for errors 
        // if there is a danger alert, there are errors
        if(dom.querySelector('.danger-alert')) {
            return [];
        }

        const appointmentSlotTableRows = Array.from(dom.querySelectorAll("[data-action='click->consent-form-appointments#selectRadioBtn']"));

        // main title looks like
        // Sign Up for Vaccinations - Dunkin Donuts Center POD on 04/20/2021
        const mainTitle = dom.querySelector('.main-title').textContent.replace('Sign Up for Vaccinations - ', '');

        // get location and date
        const vaccintationLocation = mainTitle.substring(0, mainTitle.indexOf(' on '));
        const vaccinationDate = mainTitle.substring(mainTitle.indexOf(' on ') + 4);

        // get data
        for(let appointmentSlot of appointmentSlotTableRows) {
            // each appontinemt slot should have two td tags
            // the first holds a span with the time
            // the second holds a paragraph tags with whether is it available
            const tableDataCells = appointmentSlot.querySelectorAll('td'); 
            const appointmentTime = tableDataCells[0].querySelector('span').textContent;
            const isAppointmentAvailable = tableDataCells[1].querySelector('p').textContent.includes('No');

            if(isAppointmentAvailable) {
                const validVaccineAppointment = new VaccineAppointment(
                    appointmentTime, 
                    vaccinationDate.replace(/(\r\n|\n|\r)/gm,'').replace(/\s\s+/g, ' '), // replace multiple spaces and newlines 
                    vaccintationLocation.replace(/(\r\n|\n|\r)/gm,'').replace(/\s\s+/g, ' '), // replace multiple spaces and newlines 
                    locationLink
                );
                validAppointments.push(validVaccineAppointment);
            }
        }

        return validAppointments;
    }

    async getHTML(url) {
        const res = await fetch(url);
        const html = await res.text();
        return html;
    }

    async getDOM(url) {
        const html = await this.getHTML(url);
        const dom = new JSDOM(html.toString()).window.document;
        return dom;
    }
}

module.exports = VaccineScraper;