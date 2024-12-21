/* 
* Refrences: https://stackoverflow.com/questions/32567444/accessing-sqlite3-database-in-nodejs
*Refrence: https://www.youtube.com/watch?v=_RtpUaBSie0
*/
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');  //database path varaiable

const router = express.Router();

//connect to database fiile database.db 
const dbPath = path.join(__dirname, '../database/database.db');   //database file path location
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message); //throw this error message in the cmd cocole if the database does not connect
    } else {
        console.log('Connected to SQLite database.');       //thow this message if connection is successful
    }
});

// Vulnerable SQL Injection Route
router.post('/register', (req, res) => {
    const { message, name, email, phone } = req.body;

    //log the incoming data once recived by the api
    console.log('Received data:', req.body);

    // Vulnerable query
    const sql = `INSERT INTO users (message, name, email, phone) VALUES ('${message}', '${name}', '${email}', '${phone}')`;

    db.run(sql, function (err) {

        if (err) {
            console.error('Error inserting data:', err.message);
            res.status(500).send('Failed to register. Please try again.');
        } else {
            console.log('New user added with ID:', this.lastID);
            res.send('Registration successful!');
        }

    });// end of db sql function

});// end of post request fucntion

// fetch user details in HTML page, this is for CSS vulrnability
router.get('/users', (req, res) => {
    const sql = `SELECT * FROM users`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
            let userList = '';
            rows.forEach(user => {
                userList += `<p>${user.name}: ${user.message}</p>`;
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

// Vulnerable Reflected XSS Route
router.get('/search', (req, res) => {
    const term = req.query.term || ''; // Retrieve the search term from query parameters
    res.send(`
        <html>
            <head><title>Search Opps !</title></head>
            <body>
                <h1>Sorry our services are unavilable at this time, please check again later</h1>
                <p>Search term: ${term}</p>
                <a href="/">Back to Home</a>
            </body>
        </html>
    `);
});





//login and signup code here 

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query without sanitization (vulnerable to SQL Injection)
    const sql = `SELECT * FROM auth_users WHERE username = '${username}' AND password = '${password}'`;
    db.get(sql, (err, row) => {
        if (err) {
            console.error('Error logging in:', err.message);
            res.status(500).send('Login failed.');
        } else if (row) {
            // Redirect to the welcome page with the username as a query parameter
            res.redirect(`/welcome.html?username=${username}`);
        } else {
            res.send('<p>Invalid username or password. <a href="/login.html">Try again</a></p>');
        }
    });
});




router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Insert plaintext passwords into the database
    const sql = `INSERT INTO auth_users (username, password) VALUES ('${username}', '${password}')`;
    db.run(sql, (err) => {
        if (err) {
            console.error('Error signing up:', err.message);
            res.status(500).send('Sign-up failed.');
        } else {
            res.send('<p>Sign-up successful! <a href="login.html">Login here</a></p>');
        }
    });
});


module.exports = router;
