// Import necessary modules
// Import express modules
const express = require('express');
const session = require('express-session');
// Import MySQL module
const mysql = require('mysql2');
// Import System modules
const path = require('path');
require('dotenv').config()
// Import bcrypt modules and salt
const bcrypt = require('bcrypt');
const { exists } = require('fs');
const { start } = require('repl');
const saltRounds = 5;

// Setup connection
const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE
});

// Initiate express app
const app = express();
const port = process.env.PORT || 5000;

// Gathering POST data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: process.env.SES_SEC, resave: true, saveUninitialized: false}));

// Serve the static files for the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// POST - Registration API
app.post('/api/register', function(req, res) {
    // Grabs email & password
    let email = req.body.email;
    let password = req.body.password;
    
    // Save email and password in DB
    let userPromise = new Promise(function(myResolve, myReject){
        let sql = `SELECT userID FROM users WHERE email='${email}';`

        console.log('start here');

        conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            if (rows.length == 0){
                myResolve("Creating user");
            }

            else {
                myResolve("User already exists. Try again.");
            }
        });
    });
    
    bcrypt.hash(password, saltRounds,
        async function(err, hashedPassword) {
        let value = await userPromise;
        if (err) {
            next(err);
        }
        else if (value == "Creating user") {
            sql = `INSERT INTO users (email, password) VALUES ('${email}', '${hashedPassword}');`

            conn.query(sql, function (err, rows, fields) {
                if (err) throw err;
                return res.send("Registration Complete!");
            });
        }
        else {
            return res.send("User already exists. Try again.")
        }
    });

});

// POST - Authentication API
app.post('/api/authenticate', function(req, res) {
    // Grabs email & password
    let email = req.body.email;
    let password = req.body.password;

    // Gather SQL information
    let sql = `SELECT * FROM users WHERE email='${email}' LIMIT 1;`

    conn.query(sql, function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0){
            let hashedPassword = rows[0].password;
            bcrypt.compare(password, hashedPassword, function(err, result) {
                // result == true
                if (result == true){
                    req.session.userID = rows[0].userID;
                    req.session.email = rows[0].email;
        
                    return res.send("You have been authenticated.");
                } else {
                    return res.send("This login uses incorrect email or password.");
                }
            });
        } else {
            return res.send("User doesn't exists. You should register instead!");
        }
    });
});

// POST - Add A Task To The Bot
app.post('/api/addTask', function(req, res){
    if (req.session){
        // Gather userID
        let userID = req.session.userID;
        let f_name = req.body.f_name;
        let l_name = req.body.l_name;
        let phone = req.body.phone;
        let date_picked = req.body.date_picked;
        let start_time = req.body.start_time;
        let end_time = req.body.end_time;

        let sql = `INSERT INTO task (userID, f_name, l_name, phone, date_picked, start_time, end_time, completed) VALUES ("${userID}", "${f_name}", "${l_name}", "${phone}", "${date_picked}", "${start_time}", "${end_time}", "false")`;

        conn.query(sql, function (err, rows, fields){
            if (err) throw err;
            return res.send("Task just added. We will see when the task is completed!");
        });
    }
});

// Returns any requests to the index.html
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start Express App Using A Listener On The Port
app.listen(port, function(){
    console.log('Server listening on http://localhost:'+port);
});