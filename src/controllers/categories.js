// Import model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

import { body } from 'express-validator';


// =========================
// VALIDATION
// =========================
export const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 2 })
        .withMessage('Category name must be at least 2 characters long')
];


// =========================
// SHOW ALL CATEGORIES PAGE
// =========================
const showCategoriesPage = async (req, res) => {

    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Service Project Categories',
        categories,
        activePage: 'categories'
    });
};


// =========================
// SHOW CATEGORY DETAILS PAGE
// =========================
const showCategoryDetailsPage = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: 'Category Details',
        category,
        projects,
        activePage: 'categories'
    });
};


// =========================
// ASSIGN CATEGORIES TO PROJECT
// =========================
const showAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);

    const categories = await getAllCategories();

    const assignedCategories =
        await getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        assignedCategories,
        activePage: 'projects'
    });
};


// =========================
// CREATE CATEGORY FORM
// =========================
const showNewCategoryForm = (req, res) => {

    res.render('new-category', {
        title: 'Create New Category',
        activePage: 'categories',
        errors: [],
        formData: {}
    });
};


// =========================
// PROCESS CREATE CATEGORY
// =========================
const processNewCategoryForm = async (req, res) => {

    try {

        const { category_name } = req.body;

        const errors = [];

        if (!category_name || category_name.trim() === '') {
            errors.push('Category name is required.');
        }

        if (category_name && category_name.length > 100) {
            errors.push('Category name must not exceed 100 characters.');
        }

        if (category_name && category_name.length < 3) {
            errors.push('Category name must be at least 3 characters.');
        }

        if (errors.length > 0) {

            return res.render('new-category', {
                title: 'Create New Category',
                activePage: 'categories',
                errors,
                formData: req.body
            });
        }

        await createCategory(category_name);

        req.flash('success', 'Category created successfully.');
        res.redirect('/categories');

    } catch (error) {

        console.error(error);

        req.flash('error', 'Unable to create category.');
        res.redirect('/new-category');
    }
};


// =========================
// EDIT CATEGORY FORM
// =========================
const showEditCategoryForm = async (req, res) => {

    try {

        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        res.render('edit-category', {
            title: 'Edit Category',
            activePage: 'categories',
            category,
            errors: []
        });

    } catch (error) {

        console.error(error);

        req.flash('error', 'Unable to load category.');
        res.redirect('/categories');
    }
};


// =========================
// PROCESS EDIT CATEGORY
// =========================
const processEditCategoryForm = async (req, res) => {

    try {

        const categoryId = req.params.id;
        const { category_name } = req.body;

        const errors = [];

        if (!category_name || category_name.trim() === '') {
            errors.push('Category name is required.');
        }

        if (category_name && category_name.length > 100) {
            errors.push('Category name must not exceed 100 characters.');
        }

        if (category_name && category_name.length < 3) {
            errors.push('Category name must be at least 3 characters.');
        }

        if (errors.length > 0) {

            return res.render('edit-category', {
                title: 'Edit Category',
                activePage: 'categories',
                category: {
                    category_id: categoryId,
                    category_name
                },
                errors
            });
        }

        await updateCategory(categoryId, category_name);

        req.flash('success', 'Category updated successfully.');
        res.redirect('/categories');

    } catch (error) {

        console.error(error);

        req.flash('error', 'Unable to update category.');
        res.redirect(`/edit-category/${req.params.id}`);
    }
};


// =========================
// ASSIGN CATEGORIES PROCESS
// =========================
const processAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};


// =========================
// EXPORTS (CLEAN - NO DUPLICATES)
// =========================
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};