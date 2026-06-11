// Import model functions
import {
    getUpcomingProjects,
    getProjectDetails,
    updateProject
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';


import {
    volunteerForProject,
    removeVolunteerFromProject,
    isUserVolunteer
} from '../models/volunteers.js';

import { createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Invalid date format'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Invalid organization ID')
];

// =========================
// SHOW UPCOMING PROJECTS
// =========================
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects,
        activePage: 'projects'
    });
};

// =========================
// SHOW PROJECT DETAILS PAGE
// =========================
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);

    let volunteerStatus = false;

    // check only if user is logged in
    if (req.session && req.session.user) {
        const { isUserVolunteer } = await import('../models/volunteers.js');

        volunteerStatus = await isUserVolunteer(
            req.session.user.user_id,
            projectId
        );
    }

    res.render('project', {
        title: 'Project Details',
        project,
        categories,
        activePage: 'projects',
        isLoggedIn: !!req.session.user,
        volunteerStatus
    });
};


const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();

    res.render('new-project', {
        title: 'New Project',
        organizations,
        activePage: 'projects'
    });
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    const title = 'Edit Project';

    res.render('update-project', {
        title,
        project,
        organizations,
        activePage: 'projects'
    });
};

const processEditProjectForm = async (req, res) => {
    
    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/edit-project/' + req.params.id);
    }
    
    const projectId = req.params.id;

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    await updateProject(
        projectId,
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Project updated successfully');

    res.redirect(`/project/${projectId}`);
};

const processNewProjectForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    await createProject(
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Project created successfully!');

    res.redirect('/projects');
};

const volunteerForProjectAction = async (
    req,
    res
) => {

    const userId =
        req.session.user.user_id;

    const projectId =
        req.params.id;

    await volunteerForProject(
        userId,
        projectId
    );

    req.flash(
        'success',
        'You are now volunteering for this project.'
    );

    res.redirect(`/project/${projectId}`);
};

const removeVolunteerAction = async (
    req,
    res
) => {

    const userId =
        req.session.user.user_id;

    const projectId =
        req.params.id;

    await removeVolunteerFromProject(
        userId,
        projectId
    );

    req.flash(
        'success',
        'Volunteer registration removed.'
    );

    res.redirect(`/project/${projectId}`);
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    volunteerForProjectAction,
    removeVolunteerAction
};