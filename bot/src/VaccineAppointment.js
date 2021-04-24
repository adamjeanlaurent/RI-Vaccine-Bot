class VaccineAppointment {
    constructor(time, date, location, link, numLeft) {
        this.time = time,
        this.date = date;
        this.location = location;
        this.link = link;
        this.numLeft = numLeft;
    }
}

module.exports = VaccineAppointment;