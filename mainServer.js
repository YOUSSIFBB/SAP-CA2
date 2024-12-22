const express = require('express');
const helmet = require('helmet');       //elmet for security headers
const winston = require('winston'); //winston for logging and monitoring 
const path = require('path');
const routes = require('./backendRoutes/routes');

const app = express();
const PORT = 3000;

//security Headers using Helmet
app.use(helmet());

//logging & data montioring using Winston
const logger = winston.createLogger({
    level: 'info',                          //warning, info, error, restricted
    format: winston.format.json(),
    defaultMeta: { service: 'application-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),  //error logs.txt in root file directory
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});

//system logining & monitoring of all requests, mainly GET & POST
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static files
app.use(express.static(path.join(__dirname)));

//api routes
app.use('/api', routes);

//hoempage root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    console.log(`Server running at http://localhost:${PORT}`);
});
