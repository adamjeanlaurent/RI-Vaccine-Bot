const VaccineBot = require('./src/VaccineBot');
const colors = require('colors');

const main = async () => {
    let debug = false;
    if(process.argv[2] && [process.argv[2]] === 'debug') {
        debug = true;
    }
    const vaccineBot = new VaccineBot();
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    console.log(colors.cyan('Bot Starting up🤖'));
    while(true) {
        try {
            await vaccineBot.run(debug);
            await vaccineBot.sleep(20 * MINUTE); // sleep for 20 minutes
        }
        catch(error) {
            if(process.env.NODE_ENV === 'development') {
                throw error;
            }
            // log error
            // sleep for a bit to avoid spam
            console.log(colors.red(error.message));
            await vaccineBot.sleep(5 * MINUTE);
        }
    }
}

main();