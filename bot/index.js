const VaccineBot = require('./src/VaccineBot');

const main = async () => {
    const vaccineBot = new VaccineBot();
    while(true) {
        await vaccineBot.run();
        await vaccineBot.sleep(20 * 1000); // sleep for 20 minutes
    }
}

main();