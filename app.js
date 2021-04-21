// Import necessary modules
const express = require('express');
const session = require('express-session');
const mysql = require('my-sql');
const path = require('path');
require('dotenv').config()

// Initiate express app
const app = express();
const port = process.env.PORT || 5000;

// Gathering POST data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: process.env.SES_SEC, resave: true, saveUninitialized: false}));

// Serve the static files for the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Returns any requests to the index.html
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start Express App Using A Listener On The Port
app.listen(port, function(){
    console.log('Server listening on http://localhost:'+port);
});