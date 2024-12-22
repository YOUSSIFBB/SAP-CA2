const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const winston = require('winston');
const bcrypt = require('bcrypt');
const escapeHtml = require('escape-html');

const router = express.Router();

// Logger setup for monitoring
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'api-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ],
});

// Connect to SQLite database
const dbPath = path.join(__dirname, '../database/database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        logger.error('Error connecting to SQLite database:', err.message);
    } else {
        logger.info('Connected to SQLite database.');
    }
});

// **Secure Register Route**
router.post('/register', (req, res) => {
    const { message, name, email, phone } = req.body;

    logger.info(`Register request received for name: ${name}, email: ${email}`);
    const sql = `INSERT INTO users (message, name, email, phone) VALUES (?, ?, ?, ?)`;
    db.run(sql, [escapeHtml(message), escapeHtml(name), escapeHtml(email), escapeHtml(phone)], function (err) {
        if (err) {
            logger.error('Error inserting data:', err.message);
            res.status(500).send('Failed to register. Please try again.');
        } else {
            logger.info(`New user registered with ID: ${this.lastID}`);
            res.send('Registration successful!');
        }
    });
});

// **Secure Login Route**
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    logger.info(`Login attempt for username: ${username}`);
    const sql = `SELECT * FROM auth_users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
        if (err) {
            logger.error('Error logging in:', err.message);
            res.status(500).send('Login failed.');
        } else if (row) {
            bcrypt.compare(password, row.password, (err, result) => {
                if (result) {
                    logger.info(`Login successful for username: ${username}`);
                    res.redirect(`/welcome.html?username=${username}`);
                } else {
                    logger.warn(`Invalid login attempt for username: ${username}`);
                    res.send('<p>Invalid username or password. <a href="/login.html">Try again</a></p>');
                }
            });
        } else {
            logger.warn(`Invalid login attempt for username: ${username}`);
            res.send('<p>Invalid username or password. <a href="/login.html">Try again</a></p>');
        }
    });
});

// **Secure Signup Route**
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    logger.info(`Signup attempt for username: ${username}`);
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            logger.error('Error hashing password:', err.message);
            res.status(500).send('Signup failed.');
        } else {
            const sql = `INSERT INTO auth_users (username, password) VALUES (?, ?)`;
            db.run(sql, [username, hashedPassword], (err) => {
                if (err) {
                    logger.error('Error signing up:', err.message);
                    res.status(500).send('Signup failed.');
                } else {
                    logger.info(`Signup successful for username: ${username}`);
                    res.send('<p>Sign-up successful! <a href="login.html">Login here</a></p>');
                }
            });
        }
    });
});

// **Fetch User Details (Secured)**
router.get('/users', (req, res) => {
    logger.info('Fetching all users');
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            logger.error('Error fetching data:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
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

// **Search Route (Secured)**
router.get('/search', (req, res) => {
    const term = req.query.term ? escapeHtml(req.query.term) : '';
    logger.info(`Search performed with term: ${term}`);
    res.send(`
        <html>
            <head><title>Search Results</title></head>
            <body>
                <h1>Search Unavailable</h1>
                <p>Search term: ${term}</p>
                <a href="/">Back to Home</a>
            </body>
        </html>
    `);
});

module.exports = router;
