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
const saltRounds = 5;

console.log(process.env.DB_HOST)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_BASE)

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

// app.post('/api/authenticate', function(req, res) {
//     // Grabs email & password
//     let email = req.body.email;
//     let password = req.body.password;

//     // Gather SQL information
//     let sql = 
// });

// Returns any requests to the index.html
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start Express App Using A Listener On The Port
app.listen(port, function(){
    console.log('Server listening on http://localhost:'+port);
});