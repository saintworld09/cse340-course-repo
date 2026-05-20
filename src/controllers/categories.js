// Import model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

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

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage
};