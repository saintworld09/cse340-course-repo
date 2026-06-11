import db from './db.js';

/**
 * Add volunteer to a project
 */
const volunteerForProject = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id)
        DO NOTHING;
    `;

    await db.query(query, [userId, projectId]);
};

/**
 * Remove volunteer from a project
 */
const removeVolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1
        AND project_id = $2;
    `;

    await db.query(query, [userId, projectId]);
};

/**
 * Check if user is volunteering for a project
 */
const isUserVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteers
        WHERE user_id = $1
        AND project_id = $2;
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows.length > 0;
};

/**
 * Get all projects a user is volunteering for
 */
const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.location,
            sp.date,
            o.organization_name
        FROM project_volunteers pv
        JOIN service_project sp
            ON pv.project_id = sp.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.date;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
};

export {
    volunteerForProject,
    removeVolunteerFromProject,
    isUserVolunteer,
    getVolunteerProjectsByUserId as getVolunteerProjects
};