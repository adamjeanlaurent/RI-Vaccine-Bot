// functions for doing date stuff

// convert a date yyyy-mm-dd to mm-dd-yyyy
// this is needed becase on vaccine site date is stored as mm-dd-yyyy
// and in sql you have to store dates yyyy-mm-dd
// in order to compare them, we need to convert the sql date from yyyy-mm-dd to mm-dd-yyyy
const yyyymmddTommddyyyy = (origDate) => {
    let splits = origDate.toString().split('-');
    console.log(splits);
    let year = parseInt(splits[0]);
    let month = parseInt(splits[1]);
    let day = parseInt(splits[2].substring(0,2));

    let fixed = '';
    
    // add 0 if month single digit or day single digit
    if(month < 10 && day < 10) {
        fixed = `0${month}/0${day}/${year}`
    }
    else if(month < 10) {
        fixed = `0${month}/${day}/${year}`
    }
    else if(day < 10) {
        fixed = `${month}/0${day}/${year}`
    }
    else {
        fixed = `${month}/${day}/${year}`;
    }
    
    return fixed;
}

// gets the minutes, seconds, and hours from a time
// works for AM/PM times, example: 4:40 pm
// and 24 hour times, example: 16:40:00
// this is needed because vaccine sight stores times in am/pm
// while in sql you have to store dates in 24 hr format
// in order to compare them, we need to extract the number of hours, minutes, and seconds from them and compare that
// hours are in 24 hour format for both conversions
const getHoursMinutesSeconds = (origTime) => {
    let isAM = origTime.includes('am');
    let isPM = origTime.includes('pm');

    if(isAM || isPM) {
        // orig format 11:20 am
        let seconds = 0;

        // remove am or pm
        origTime = origTime.substring('0', origTime.length - 3);
        let splits = origTime.split(':');
        
        // if PM time, then in 24 hr time = hours + hours % 12, example 1PM = 13:00
        let hours = isPM ? 12 + (parseInt(splits[0]) % 12) : parseInt(splits[0]);
        let minutes = parseInt(splits[1]);
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
    }

    else {
        // orig format 09:00:00
        let splits = origTime.split(':');
        return {
            hours: parseInt(splits[0]),
            minutes: parseInt(splits[1]),
            seconds: parseInt(splits[2])
        }
    }
}

exports.yyyymmddTommddyyyy = yyyymmddTommddyyyy;
exports.getHoursMinutesSeconds = getHoursMinutesSeconds;