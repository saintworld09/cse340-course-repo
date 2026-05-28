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

import { showEditProjectForm, processEditProjectForm, showProjectDetailsPage, showProjectsPage,showNewProjectForm,processNewProjectForm,projectValidation } from './controllers/projects.js';

import { showCategoryDetailsPage, 
         showCategoriesPage,
         showAssignCategoriesForm,
         processAssignCategoriesForm,
         showNewCategoryForm,
         processNewCategoryForm,
         showEditCategoryForm,
         processEditCategoryForm
} 
from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// =======================
// MAIN ROUTES
// =======================

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/projects', showProjectsPage);

router.get('/categories', showCategoriesPage);

// =======================
// ORGANIZATION ROUTES
// =======================

router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/new-organization', showNewOrganizationForm);

// Show edit form
router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

// Process edit form
router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

// =======================
// PROJECT ROUTES
// =======================

router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get('/edit-project/:id', showEditProjectForm);

router.post('/edit-project/:id', projectValidation,processEditProjectForm);

// =======================
// CATEGORY ROUTES
// =======================

router.get('/category/:id', showCategoryDetailsPage);

router.get(
    '/assign-categories/:projectId',
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    processAssignCategoriesForm
);

router.get('/new-category', showNewCategoryForm);

router.post('/new-category', processNewCategoryForm);

router.get('/edit-category/:id', showEditCategoryForm);

router.post('/edit-category/:id', processEditCategoryForm);

router.get('/categories', async (req, res) => {

    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Categories',
        activePage: 'categories',
        categories
    });
});

// =======================
// ERROR TEST ROUTE
// =======================

router.get('/test-error', testErrorPage);

export default router;