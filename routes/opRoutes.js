const express = require('express');
const conn = require('../db/connection');

const router = express.Router();

// POST - Add A Task To The Bot
router.post('/addTask', function(req, res){
    if (typeof req.session.userID !== "undefined"){
        // Gather userID
        let userID = req.session.userID;
        let f_name = req.body.f_name;
        let l_name = req.body.l_name;
        let phone = req.body.phone;
        let date_picked = req.body.date_picked;
        let start_time = req.body.start_time;
        let end_time = req.body.end_time;

        let sql = `INSERT INTO task (userID, f_name, l_name, phone, date_picked, start_time, end_time, completed) VALUES ("${userID}", "${f_name}", "${l_name}", "${phone}", "${date_picked}", "${start_time}", "${end_time}", "false")`;
        console.log(sql);

        conn.query(sql, function (err, rows, fields){
            if (err) throw err;
            return res.send("Task just added. We will see when the task is completed!");
        });
    } else {return res.send("No session detected.");}
});

// GET - List My Tasks
router.get('/getTasks', async function(req, res){
    // Make sure user is signed in.
    if(typeof req.session.userID !== "undefined"){
        //Grab userID of session
        let userID = req.session.userID;

        let sql = `SELECT * FROM task WHERE userID = ${userID};`;

        let userPromise = new Promise(function(myResolve, myReject){
            let jsonReturn = new Array();
            console.log(sql);
            let dbCallback = function(callback){
                conn.query(sql, function (err, rows, fields){
                    if (err) throw err;
                    if (rows.length == 0){return res.send("No tasks for this user.");}
                    console.log("dbPromise");
                    for(var i = 0; i < rows.length; i++){
                        console.log(i);
                        let json = {
                            "TaskID": rows[i].taskID,
                            "FirstName": rows[i].f_name,
                            "LastName": rows[i].l_name,
                            "Phone": rows[i].phone,
                            "Date": rows[i].date_picked,
                            "StartTime": rows[i].start_time,
                            "EndTime": rows[i].end_time,
                            "Completed": rows[i].completed
                        };
                        jsonReturn.push(json);
                    }
                    callback(null, jsonReturn);
                });
            };
            dbCallback(function(err, jsonReturn){
                if (err) console.log("Database error!");
                else {console.log(jsonReturn); myResolve(jsonReturn);}
            });
        });
        
        let jsonData = await userPromise;
        return res.send(jsonData);
    } else {return res.send("No session detected.");}
});

module.exports = router;