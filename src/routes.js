import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { getAllCategories } from './models/categories.js';

import {
    showEditProjectForm,
    processEditProjectForm,
    showProjectDetailsPage,
    showProjectsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoryDetailsPage,
    showCategoriesPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
} from './controllers/users.js';

const router = express.Router();


// =======================
// MAIN ROUTES
// =======================

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/projects', showProjectsPage);

router.get('/categories', showCategoriesPage);


// =======================
// ORGANIZATION ROUTES (ADMIN ONLY)
// =======================

router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);


// =======================
// PROJECT ROUTES (ADMIN ONLY)
// =======================

router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', requireRole('admin'), showNewProjectForm);

router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);


// =======================
// CATEGORY ROUTES (ADMIN ONLY WHERE REQUIRED)
// =======================

router.get('/category/:id', showCategoryDetailsPage);

router.get(
    '/assign-categories/:projectId',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    requireRole('admin'),
    processAssignCategoriesForm
);

router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);


// =======================
// USER ROUTES
// =======================

router.get('/register', showUserRegistrationForm);

router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);

router.post('/login', processLoginForm);

router.get('/logout', processLogout);

router.get('/users', requireRole('admin'), showUsersPage);


// =======================
// DASHBOARD (PROTECTED)
// =======================

router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);


// =======================
// ERROR TEST ROUTE
// =======================

router.get('/test-error', testErrorPage);

export default router;