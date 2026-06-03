import bcrypt from 'bcrypt';
import {
    getAllUsers,
    createUser,
    findUserByEmail
} from '../models/users.js';

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
        req.flash('error', 'Unable to load users page.');
        res.redirect('/dashboard');
    }
};


export const requireLogin = (req, res, next) => {

    if (!req.session || !req.session.user) {

        return res.render('login', {
            title: 'Login',
            activePage: 'login',
            errorMessage: 'You must log in first.'
        });
    }

    next();
};


export const showDashboard = (req, res) => {

    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        activePage: 'dashboard',
        name: user.name,
        email: user.email
    });
};



/**
 * Show registration form
 */
export function showUserRegistrationForm(req, res) {
    res.render('register', {
        title: 'User Registration',
        activePage: 'register'
    }); 
}

/**
 * Handle registration
 */
export async function processUserRegistrationForm(req, res) {
    try {
        const { name, email, password } = req.body;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await createUser(name, email, passwordHash);

        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error registering user');
    }
}

export const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login',
        activePage: 'login',
        errorMessage: null
    });
};

export const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(
            email,
            password
        );

        if (user) {
            req.session.user = user;

            console.log('User logged in:', user);

            return res.redirect('/dashboard');
        }

        return res.render('login', {
            title: 'Login',
            activePage: 'login',
            errorMessage: 'Incorrect email or password'
        })

    } catch (error) {
        console.error(error);

        return res.redirect('login', {
            title: 'Login',
            activePage: 'login',
            errorMessage: 'An error occurred while logging in.'
        });
    }
};

export const processLogout = (req, res) => {
    req.session.destroy((err) => {

        if (err) {
            console.error(err);
            return res.redirect('/');
        }

        res.redirect('/login');
    });
};

export async function authenticateUser(email, password) {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        return null;
    }

    delete user.password_hash;

    return user;
}

export const requireRole = (role) => {
    return (req, res, next) => {

        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You are not authorized to access this page.');
            return res.redirect('/');
        }

        next();
    };
};