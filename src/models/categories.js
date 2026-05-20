import db from './db.js';

// =========================
// GET ALL CATEGORIES
// =========================
const getAllCategories = async () => {
    const query = `
        SELECT category_id, category_name
        FROM public.categories
        ORDER BY category_name;
    `;

    const result = await db.query(query);
    return result.rows;
};

// =========================
// GET CATEGORY BY ID
// =========================
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, category_name
        FROM public.categories
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// =========================
// GET CATEGORIES FOR A PROJECT
// =========================
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM public.categories c
        JOIN public.project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

// =========================
// GET PROJECTS FOR A CATEGORY
// =========================
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id
        FROM public.service_project p
        JOIN public.project_categories pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

// =========================
// EXPORTS
// =========================
export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};