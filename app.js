// Import necessary modules
// Import express modules
const express = require('express');
const session = require('express-session');
// Import System modules
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const { exists } = require('fs');
const { start } = require('repl');

// Adding routes
const authRoutes = require('./routes/authRoutes');
const opRoutes = require('./routes/opRoutes');

// Initiate express app
const app = express();
const port = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Gathering POST data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: process.env.SES_SEC, resave: true, saveUninitialized: false}));

// Serve the static files for the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', opRoutes);

// Returns any requests to the index.html
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start Express App Using A Listener On The Port
app.listen(port, function(){
    console.log('Server listening on http://localhost:' + port);
});