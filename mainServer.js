const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

//pare data to jason fromat
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//server express set to static 
app.use(express.static(path.join(__dirname)));

//Import api file path routes (routes.js)
const routes = require('./backendRoutes/routes');
app.use('/api', routes);

//lauch server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);  //serving running with port number
    console.log(`Access the homepage at http://localhost:${PORT}/index.html`);  //homepage link 
    console.log(`Access the registration page at http://localhost:${PORT}/Regestration.html`);  //regestration page link
});
