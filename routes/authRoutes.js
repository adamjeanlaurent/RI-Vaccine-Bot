const express = require('express');
const conn = require('../db/connection');
const bcrypt = require('bcrypt');
const saltRounds = 5;

const router = express.Router();

router.post('/register', function(req, res) {
    // Grabs email & password
    let email = req.body.email;
    let password = req.body.password;
    
    // Save email and password in DB
    if (email != "" && password != ""){
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
    } else {
        return res.send("Need the email and password to make a user.");
    }
});

// POST - Authentication API
router.post('/authenticate', function(req, res) {
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

// GET - Logout API
router.get('/logout', function(req, res){
    req.session.destroy();
    res.send('Session is destroyed.');
});

module.exports = router;