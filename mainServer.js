const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

//transfer data into jason froamt 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Enable CORS if needed for different ports and connections 
app.use(cors());

//Serve static files for htmls files 
app.use(express.static(path.join(__dirname)));

// Import backend API routes
const routes = require('./backendRoutes/routes');
app.use('/api', routes);

//Start the server, links should be provided in the command prompt, just click on the link to be directed to the website
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);   //confirm that the server is running and specify the port, i didnt not assign a port here this is determined by your host machine
    console.log(`Access the homepage at http://localhost:${PORT}/index.html`);  //homepage link 
    console.log(`Access the registration page at http://localhost:${PORT}/Regestration.html`);  //regestration page link
});
