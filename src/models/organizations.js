import db from './db.js';

// Get all organizations
const getAllOrganizations = async () => {
    const query = `
        SELECT
            organization_id,
            organization_name,
            organization_description,
            contact_email,
            logo_filename
        FROM public.organization
        ORDER BY organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Get single organization
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            organization_name,
            organization_description,
            contact_email,
            logo_filename
        FROM public.organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows[0];
};

// Create organization
const createOrganization = async (
    name,
    description,
    contactEmail,
    logoFilename
) => {
    const query = `
        INSERT INTO public.organization
        (
            organization_name,
            organization_description,
            contact_email,
            logo_filename
        )
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const values = [
        name,
        description,
        contactEmail,
        logoFilename
    ];

    const result = await db.query(query, values);

    return result.rows[0].organization_id;
};

const updateOrganization = async (
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename
) => {
    const query = `
        UPDATE organization
        SET organization_name = $1,
            organization_description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
        RETURNING organization_id;
    `;

    const values = [
        name,
        description,
        contactEmail,
        logoFilename,
        organizationId
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Organization not found');
    }

    return result.rows[0].organization_id;
};

export {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
};