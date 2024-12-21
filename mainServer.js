const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

//parse jason data middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static files
app.use(express.static(path.join(__dirname)));

//api routes
const routes = require('./backendRoutes/routes');
app.use('/api', routes); // Mount the routes on the "/api" path

//run server and dsiplay all pages on console log
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`); // Log server URL
    console.log(`Access the homepage at http://localhost:${PORT}/index.html`); // Log homepage link
    console.log(`Access the registration page at http://localhost:${PORT}/Regestration.html`); // Log registration page link
});
