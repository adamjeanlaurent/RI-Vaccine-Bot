const VaccineBot = require('./src/VaccineBot');
const colors = require('colors');

const main = async () => {
    const vaccineBot = new VaccineBot();
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    while(true) {
        try {
            await vaccineBot.run();
            await vaccineBot.sleep(20 * MINUTE); // sleep for 20 minutes
        }
        catch(error) { 
            // log error
            // sleep for a bit to avoid spam
            console.log(colors.red(error.message));
            await vaccineBot.sleep(5 * MINUTE);
        }
    }
}

main();