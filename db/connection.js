// Import MySQL module
const mysql = require('mysql2');
require('dotenv').config()

// Setup connection
const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE
});

module.exports = conn;