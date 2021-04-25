const VaccineBot = require('./src/VaccineBot');

const main = async () => {
    const vaccineBot = new VaccineBot();
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    while(true) {
        await vaccineBot.run();
        await vaccineBot.sleep(20 * MINUTE); // sleep for 20 minutes
    }
}

main();