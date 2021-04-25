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