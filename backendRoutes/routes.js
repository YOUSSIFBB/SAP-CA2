const express = require('express');
const sqlite3 = require('sqlite3').verbose();   //database 
const bcrypt = require('bcrypt');           //password hashing algorithm
const escapeHtml = require('escape-html');  //sanitising user input from XSS and DOm based attacks
const path = require('path');
const winston = require('winston');

const router = express.Router();

//montioring step up to log all user interactions with the application
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'api-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});

//database connection
const dbPath = path.join(__dirname, '../database/database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        logger.error('Error connecting to SQLite database:', err.message);
    } else {
        logger.info('Connected to SQLite database.');
    }
});

//updated regsiters route with santised inputs against sql injections
router.post('/register', (req, res) => {
    const { message, name, email, phone } = req.body;

    logger.info(`Register request received for name: ${name}, email: ${email}`);
    const sql = `INSERT INTO users (message, name, email, phone) VALUES (?, ?, ?, ?)`;
    db.run(sql, [escapeHtml(message), escapeHtml(name), escapeHtml(email), escapeHtml(phone)], function (err) {
        if (err) {
            logger.error('Error inserting data:', err.message);
            res.status(500).send('Failed to register. Please try again.');
        } else {
            logger.info(`New user added with ID: ${this.lastID}`);
            res.send('Registration successful!');
        }
    });
});

//imrpoved login security with password decryption
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    logger.info(`Login attempt for username: ${username}`); //log user login-attempt
    const sql = `SELECT * FROM auth_users WHERE username = ?`; //paramaterized query to prevent SQL injection
    db.get(sql, [username], (err, row) => {
        if (err) {
            logger.error('Error logging in:', err.message);
            res.status(500).send('Login failed.');
        } else if (row) {
            bcrypt.compare(password, row.password, (err, result) => {    //compare hashed passwords
                if (result) {
                    logger.info(`Login successful for username: ${username}`);  //log user login-attempt on successfull regestration
                    res.redirect(`/welcome.html?username=${username}`);
                } else {
                    logger.warn(`Invalid login attempt for username: ${username}`);  //log user login-attempt on failed regestration
                    res.send('<p>Invalid username or password. <a href="/login.html">Try again</a></p>');
                }
            });
        } else {
            logger.warn(`Invalid login attempt for username: ${username}`); //log user login-attempt on failed regestration either by user or  system
            res.send('<p>Invalid username or password. <a href="/login.html">Try again</a></p>');
        }
    });
});

//improved sign-up with hashed passwords and monitoring
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    logger.info(`Signup attempt for username: ${username}`);
    const saltRounds = 10;       //number of salt rounds for bcrypt algorithm
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {   //password hashing
        if (err) {
            logger.error('Error hashing password:', err.message);   //log this error message if the system fails to hash the password
            res.status(500).send('Signup failed.');
        } else {
            const sql = `INSERT INTO auth_users (username, password) VALUES (?, ?)`;  //improved sanitise queries to regester the new user with the hashed password
            db.run(sql, [username, hashedPassword], (err) => {
                if (err) {
                    logger.error('Error signing up:', err.message);     //log system error on failed sign-up
                    res.status(500).send('Signup failed.');
                } else {
                    logger.info(`Signup successful for username: ${username}`);     //log sucessful regestration
                    res.send('<p>Sign-up successful! <a href="login.html">Login here</a></p>');
                }
            });
        }
    });
});

//fetches all users and sanitizes their data before sending to the client
router.get('/users', (req, res) => {
    logger.info('Fetching all users');
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            logger.error('Error fetching data:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
            //sanitise and format the output
            let userList = '';
            rows.forEach(user => {
                userList += `<p>${escapeHtml(user.name)}: ${escapeHtml(user.message)}</p>`;
            });
            res.send(`
                <html>
                    <body>
                        <h1>User Messages</h1>
                        ${userList}
                    </body>
                </html>
            `);
        }
    });
});

//display sanitised search term to preven XSS attacks
router.get('/search', (req, res) => {
    const term = req.query.term ? escapeHtml(req.query.term) : ''; //sanitise user input
    logger.info(`Search performed with term: ${term}`);    //log user search attempt
    res.send(`                                              
        <html>
            <head><title>Search Results</title></head>
            <body>
                <h1>Search Unavailable</h1>
                <p>Search term: ${term}</p>
                <a href="/">Back to Home</a>
            </body>
        </html>
    `);     //display the seach output to the user
});

module.exports = router;
