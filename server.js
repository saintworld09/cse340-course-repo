import 'dotenv/config';

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import session from 'express-session';

import flash from './src/middleware/flash.js';

// Database test
import { testConnection } from './src/models/db.js';

// Router
import router from './src/routes.js';

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase() || 'production';

const PORT = process.env.PORT || 3000;

const SESSION_SECRET = process.env.SESSION_SECRET;

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS view engine
app.set('view engine', 'ejs');

// FIXED views path
app.set('views', path.join(__dirname, 'src', 'views'));

/**
 * REQUEST LOGGER
 */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/**
 * GLOBAL VARIABLES
 */
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));

app.get('/test-session', (req, res) => {
    req.session.test = "Hello Session";
    res.send("Session set!");
});

app.use(flash);

/**
 * ROUTES
 */
app.use('/', router) 

/**
 * 404 HANDLER
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error(err.stack);

    const status = err.status || 500;

    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack,
        activePage: ''
    });
});

/**
 * START SERVER
 */
app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);

    } catch (error) {
        console.error('Database connection failed:', error);
    }
});

