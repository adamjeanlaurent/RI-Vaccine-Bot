const VaccineBot = require('./src/VaccineBot');
const colors = require('colors');
const Spinner = require('cli-spinner').Spinner;

const main = async () => {
    let debug = false;
    if(process.argv[2] && [process.argv[2]] === 'debug') {
        debug = true;
    }
    const processingSpinner = new Spinner('bot processing🤖... %s');
    const sleepSpinner = new Spinner('bot sleeping🤖... %s');
    processingSpinner.setSpinnerString('|/-\\');
    sleepSpinner.setSpinnerString('|/-\\');

    const vaccineBot = new VaccineBot();
    const SECOND = 1000;
    const MINUTE = SECOND * 60;

    console.log(colors.cyan('Bot Starting up🤖'));

    while(true) {
        try {
            processingSpinner.start();
            await vaccineBot.run(debug);
            processingSpinner.stop(false);
            sleepSpinner.start();
            await vaccineBot.sleep(20 * MINUTE); // sleep for 20 minutes
            sleepSpinner.stop(false);
        }
        catch(error) {
            processingSpinner.stop(false);
            sleepSpinner.stop(false);
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