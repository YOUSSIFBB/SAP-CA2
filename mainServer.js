const express = require('express');
const path = require('path');
const helmet = require('helmet');
const winston = require('winston');
const routes = require('./backendRoutes/routes');

const app = express();
const PORT = 3000;

// Security Headers using Helmet
app.use(helmet());

// Logging with Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'application-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Error logs
        new winston.transports.File({ filename: 'combined.log' }),             // General logs
        new winston.transports.Console({ format: winston.format.simple() })   // Console logs
    ],
});

// Middleware to log every request
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Middleware to parse incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Mount API routes
app.use('/api', routes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    console.log(`Server running at http://localhost:${PORT}`);
});
