CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    
    organization_name VARCHAR(150) NOT NULL,
    
    organization_description TEXT NOT NULL,
    
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    
    logo_filename VARCHAR(255) NOT NULL
);