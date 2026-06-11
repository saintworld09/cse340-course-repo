import bcrypt from 'bcrypt';

import {
    getAllUsers,
    createUser,
    findUserByEmail
} from '../models/users.js';

import {
    getVolunteerProjects
} from '../models/volunteers.js';


// =====================================
// ADMIN USERS PAGE
// =====================================

export const showUsersPage = async (req, res) => {

    try {

        const users = await getAllUsers();

        res.render('users', {
            title: 'Registered Users',
            activePage: 'users',
            users
        });

    } catch (error) {

        console.error(error);

        req.flash(
            'error',
            'Unable to load users page.'
        );

        res.redirect('/dashboard');
    }
};


// =====================================
// LOGIN PROTECTION
// =====================================

export const requireLogin = (
    req,
    res,
    next
) => {

    if (
        !req.session ||
        !req.session.user
    ) {

        return res.render('login', {
            title: 'Login',
            activePage: 'login',
            errorMessage:
                'You must log in first.'
        });
    }

    next();
};


// =====================================
// DASHBOARD
// =====================================

export const showDashboard = async (
    req,
    res
) => {

    try {

        const user =
            req.session.user;

        const volunteerProjects =
            await getVolunteerProjects(
                user.user_id
            );

        res.render('dashboard', {
            title: 'Dashboard',
            activePage: 'dashboard',
            name: user.name,
            email: user.email,
            volunteerProjects
        });

    } catch (error) {

        console.error(error);

        req.flash(
            'error',
            'Unable to load dashboard.'
        );

        res.redirect('/');
    }
};


// =====================================
// REGISTRATION PAGE
// =====================================

export const showUserRegistrationForm =
(req, res) => {

    res.render('register', {
        title: 'User Registration',
        activePage: 'register'
    });
};


// =====================================
// PROCESS REGISTRATION
// =====================================

export const processUserRegistrationForm =
async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        const saltRounds = 10;

        const passwordHash =
            await bcrypt.hash(
                password,
                saltRounds
            );

        await createUser(
            name,
            email,
            passwordHash
        );

        res.redirect('/login');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error registering user'
        );
    }
};


// =====================================
// LOGIN PAGE
// =====================================

export const showLoginForm = (
    req,
    res
) => {

    res.render('login', {
        title: 'Login',
        activePage: 'login',
        errorMessage: null
    });
};


// =====================================
// PROCESS LOGIN
// =====================================

export const processLoginForm =
async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {

        const user =
            await authenticateUser(
                email,
                password
            );

        if (user) {

            req.session.user = user;

            console.log(
                'User logged in:',
                user
            );

            return res.redirect(
                '/dashboard'
            );
        }

        return res.render('login', {
            title: 'Login',
            activePage: 'login',
            errorMessage:
                'Incorrect email or password'
        });

    } catch (error) {

        console.error(error);

        return res.render('login', {
            title: 'Login',
            activePage: 'login',
            errorMessage:
                'An error occurred while logging in.'
        });
    }
};


// =====================================
// LOGOUT
// =====================================

export const processLogout = (
    req,
    res
) => {

    req.session.destroy((err) => {

        if (err) {

            console.error(err);

            return res.redirect('/');
        }

        res.redirect('/login');
    });
};


// =====================================
// AUTHENTICATE USER
// =====================================

export const authenticateUser =
async (
    email,
    password
) => {

    const user =
        await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordMatch =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!passwordMatch) {
        return null;
    }

    delete user.password_hash;

    return user;
};


// =====================================
// ROLE PROTECTION
// =====================================

export const requireRole = (
    role
) => {

    return (
        req,
        res,
        next
    ) => {

        if (
            !req.session ||
            !req.session.user
        ) {

            req.flash(
                'error',
                'You must be logged in.'
            );

            return res.redirect(
                '/login'
            );
        }

        if (
            req.session.user.role_name !== role
        ) {

            req.flash(
                'error',
                'You are not authorized to access this page.'
            );

            return res.redirect('/');
        }

        next();
    };
};