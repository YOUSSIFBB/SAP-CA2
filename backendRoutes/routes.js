/* Refrences:
 * https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction
 * https://stackoverflow.com/questions/32567444/accessing-sqlite3-database-in-nodejs
 * https://www.youtube.com/watch?v=_RtpUaBSie0
 * https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction
 * 
 *  
*/
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

//connect to SQLite database
const dbPath = path.join(__dirname, '../database/database.db'); //path to database file
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message); //throw this error message if database connection fails
    } else {
        console.log('Connected to SQLite database.');
    }
});

//register route 
router.post('/register', (req, res) => {
    const { message, name, email, phone } = req.body; //extract user input from body request
    console.log('Received data:', req.body);

    const sql = `INSERT INTO users (message, name, email, phone) VALUES ('${message}', '${name}', '${email}', '${phone}')`; //vulnerable query
    db.run(sql, function (err) {
        if (err) {
            console.error('Error inserting data:', err.message); //throw this message if there is an error sending the regestry message data from the regesteration.html
            res.status(500).send('Failed to register. Please try again.'); // Respond with error
        } else {
            console.log('New user added with ID:', this.lastID); // Log the new user's ID, this is the database primary key for user table
            res.send('Registration successful!'); //throw this message to the user when regestration is successful
        }
    });
});

//login route 
router.post('/login', (req, res) => {
    const { username, password } = req.body; //extract user input from body request

    const sql = `SELECT * FROM auth_users WHERE username = '${username}' AND password = '${password}'`; //vulnerable query
    db.get(sql, (err, row) => {
        if (err) {
            console.error('Error logging in:', err.message); //throw this error message if application cannot get user credentails from the auth_users table
            res.status(500).send('Login failed.');
        } else if (row) {
            res.redirect(`/welcome.html?username=${username}`); //send the user to the welcome page with thier username on the html page
        } else {
            res.send('<p>Invalid username or password. <a href="/login.html">Try again</a></p>'); //display this message on a failed log-in with the login page link to rediect the user
        }
    });
});

//sign-up route
router.post('/signup', (req, res) => {
    const { username, password } = req.body; //extract user input from body request

    const sql = `INSERT INTO auth_users (username, password) VALUES ('${username}', '${password}')`; //vulnerable query
    db.run(sql, (err) => {
        if (err) {
            console.error('Error signing up:', err.message); //throw this error message if the system is unable to regester the new user to the auth_user table
            res.status(500).send('Sign-up failed.');
        } else {
            res.send('<p>Sign-up successful! <a href="login.html">Login here</a></p>'); //redirect the user to the login-page upon scucessful regesration sign-up 
        }
    });
});

//fetch user details (for potential XSS vulnerability)
router.get('/users', (req, res) => {
    const sql = `SELECT * FROM users`; // Fetch all users from the database
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message); // Log error on query failure
            res.status(500).send('Error retrieving data');
        } else {
            let userList = '';
            rows.forEach(user => {
                userList += `<p>${user.name}: ${user.message}</p>`; // Render user messages directly without sanitization (vulnerable)
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

//XSS vulnerability allowing the user to enter milicous code, intender fot the user to search for a service in html page
router.get('/search', (req, res) => {
    const term = req.query.term || ''; // Extract search term from query string
    res.send(`
        <html>
            <head><title>Search Results</title></head>
            <body>
                <h1>Search Unavailable</h1>
                <p>Search term: ${term}</p> <!-- Vulnerable to reflected XSS -->
                <a href="/">Back to Home</a>
            </body>
        </html>
    `);
});

module.exports = router; //export routes 
