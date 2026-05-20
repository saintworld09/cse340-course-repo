import 'dotenv/config';

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Import database connection test
import { testConnection } from './src/models/db.js';

// Import router
import router from './src/routes.js';

// Define the application environment
const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase()
    || 'production';

// Define the port number
const PORT = process.env.PORT || 3000;

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */

// Serve static files
app.use(express.static(
    path.join(__dirname, 'public')
));

// Set EJS
app.set('view engine', 'ejs');

// Views location
app.set(
    'views',
    path.join(__dirname, 'src/views')
);

// Request logger
app.use((req, res, next) => {

    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});

// Make NODE_ENV available to views
app.use((req, res, next) => {

    res.locals.NODE_ENV = NODE_ENV;

    next();
});

// Use routes
app.use(router);

/**
 * 404 handler
 */

app.use((req, res, next) => {

    const err = new Error('Page Not Found');

    err.status = 404;

    next(err);
});

/**
 * Global error handler
 */

app.use((err, req, res, next) => {

    console.error('Error occurred:', err.message);

    console.error(err.stack);

    const status = err.status || 500;

    const template =
        status === 404 ? '404' : '500';

    const context = {
        title:
            status === 404
                ? 'Page Not Found'
                : 'Server Error',

        error: err.message,

        stack: err.stack,

        activePage: ''
    };

    res
        .status(status)
        .render(`errors/${template}`, context);
});

/**
 * Start server
 */

app.listen(PORT, async () => {

    try {

        await testConnection();

        console.log(
            `Server is running at http://127.0.0.1:${PORT}`
        );

        console.log(`Environment: ${NODE_ENV}`);

    } catch (error) {

        console.error(
            'Error connecting to the database:',
            error
        );
    }
});