// Import model functions
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

    res.render('project', {
        title: 'Project Details',
        project,
        categories,
        activePage: 'projects'
    });
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};