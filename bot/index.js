const VaccineBot = require('./src/VaccineBot');
const colors = require('colors');
const Spinner = require('cli-spinner').Spinner;

const main = async () => {
    let debug = false;
    if(process.argv[2] && [process.argv[2]] === 'debug') {
        debug = true;
    }
    const spinner = new Spinner('bot processing🤖... %s');
    spinner.setSpinnerString('|/-\\');
    const vaccineBot = new VaccineBot();
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    console.log(colors.cyan('Bot Starting up🤖'));
    while(true) {
        try {
            spinner.start();
            await vaccineBot.run(debug);
            spinner.stop(false);
            console.log(colors.magenta('Bot Sleeping🤖'));
            await vaccineBot.sleep(20 * MINUTE); // sleep for 20 minutes
        }
        catch(error) {
            spinner.stop(false);
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