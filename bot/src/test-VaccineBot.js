const connection = require('./connection');
const VaccineBot = require('./VaccineBot');

const assert = require('assert');

const createTestUserAndTask = async () => {
    // create test user
    await connection.execute(
        'INSERT INTO users(email, password) VALUES(?, ?)',
        ['testUser@test.com', 'test123']
    );

    // create test task
    await connection.execute(
        'INSERT INTO task (userID, f_name, l_name, phone, date_picked, start_time, end_time, completed) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
        [1, 'john', 'doe', '401-453-6532', '2021-04-21', '09:00:00', '11:00', 0]
    );
}

const deleteTestUserAndTask = async () => {
    // get test userid
    const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        ['testUser@test.com']
    );
    
    const testUserID = rows[0].userID;

    // delete test task
    await connection.execute(
        'DELETE * FROM task WHERE userID = ?',
        [testUserID]
    );

    // delete test user
    await connection.execute(
        'DELETE * FROM users WHERE email = ?',
        ['testUser@test.com']
    );
}

const getMockAppointments = () => {
    return [
        {
            time: '11:10 am',
            date: '04/23/2021',
            location: 'East Providence POD',
            link: 'https://www.vaccinateri.org/client/registration?clinic_id=2055'
        },
        {
            time: '11:15 am',
            date: '04/23/2021',
            location: 'East Providence POD',
            link: 'https://www.vaccinateri.org/client/registration?clinic_id=2055'
        },
        {
            time: '11:20 am',
            date: '04/23/2021',
            location: 'East Providence POD',
            link: 'https://www.vaccinateri.org/client/registration?clinic_id=2055'
        }
    ];
}

const testProcessTaskQueue = async () => {
    let availableAppointments = getMockAppointments();

    let appointmentsMap = new Map();

    for(let app of availableAppointments) {
        if(appointmentsMap.has(app.date)) {
            appointmentsMap.get(app.date).push(app);
        }
        else {
            appointmentsMap.set(app.date, [ app ]);
        }
    }

    let vaccineBot = new VaccineBot();

    const taskQueue = await vaccineBot.getUncompletedTasks();

    const matchingAppointments = await matchingAppointments.processTaskQueue(taskQueue, appointmentsMap);

    assert.strictEqual(matchingAppointments.length, 1, 'there should be 1 valid matching appointment');
    assert.strictEqual(matchingAppointments[0].time, availableAppointments[0].time, 'appointment time should be 11:10 am');
    assert.strictEqual(matchingAppointments[0].location, availableAppointments[0].location, 'location should be East Providence POD');
    assert.strictEqual(matchingAppointments[0].link, availableAppointments[0].link, 'link should be https://www.vaccinateri.org/client/registration?clinic_id=2055');
    assert.strictEqual(matchingAppointments[0].date, availableAppointments[0].date, 'date should be 04/23/2021');
    assert.strictEqual(matchingAppointments[0].firstname, 'john', 'first name should be john');
    assert.strictEqual(matchingAppointments[0].lastname, 'doe', 'last name should be doe');
}

testProcessTaskQueue();