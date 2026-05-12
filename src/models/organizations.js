import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, organization_name, organization_description, contact_email, logo_filename
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllOrganizations}