CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    
    organization_name VARCHAR(150) NOT NULL,
    
    organization_description TEXT NOT NULL,
    
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    
    logo_filename VARCHAR(255) NOT NULL
);

-- Inserting values into the organization table

INSERT INTO organization (
    organization_name,
    organization_description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


--- creating a new table called the service_project table

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
);


---inserting values to the service_project table

INSERT INTO service_project
(organization_id, title, description, location, date)

VALUES
-- BrightFuture Builders Projects
(1, 'Community Housing Repair',
'Helping repair damaged homes for low-income families.',
'Lagos', '2026-06-10'),

(1, 'Bridge Construction Support',
'Assist engineers with local bridge improvement projects.',
'Abuja', '2026-06-15'),

(1, 'School Renovation',
'Renovating classrooms in rural schools.',
'Ibadan', '2026-06-20'),

(1, 'Public Park Restoration',
'Restore damaged public recreational parks.',
'Port Harcourt', '2026-06-25'),

(1, 'Clean Water Installation',
'Installing water systems in local communities.',
'Kano', '2026-06-30'),

-- GreenHarvest Growers Projects
(2, 'Urban Farming Workshop',
'Teaching residents sustainable farming techniques.',
'Lagos', '2026-07-05'),

(2, 'Community Garden Setup',
'Building local food gardens in neighborhoods.',
'Abeokuta', '2026-07-08'),

(2, 'Tree Planting Campaign',
'Planting trees to improve environmental sustainability.',
'Enugu', '2026-07-12'),

(2, 'Youth Farming Program',
'Training young people in urban agriculture.',
'Jos', '2026-07-16'),

(2, 'Food Sustainability Outreach',
'Community awareness campaign on food sustainability.',
'Benin City', '2026-07-20'),

-- UnityServe Volunteers Projects
(3, 'Food Drive Initiative',
'Collecting and distributing food supplies.',
'Lagos', '2026-08-01'),

(3, 'Community Tutoring',
'Providing free tutoring services for students.',
'Ilorin', '2026-08-05'),

(3, 'Hospital Volunteer Support',
'Helping patients and hospital staff.',
'Kaduna', '2026-08-10'),

(3, 'Charity Fundraiser',
'Raising funds for local charity organizations.',
'Ibadan', '2026-08-15'),

(3, 'Neighborhood Cleanup',
'Cleaning streets and public spaces.',
'Akure', '2026-08-20');

--- Creating categories table

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

---- creating a junction table

CREATE TABLE project_categories (
    project_id INTEGER,
    category_id INTEGER,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id) REFERENCES service_project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

--- Insert into categories

INSERT INTO categories (category_name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- Environmental projects
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1),
(2, 1);

-- Educational projects
INSERT INTO project_categories (project_id, category_id) VALUES
(3, 2),
(4, 2);

-- Community Service
INSERT INTO project_categories (project_id, category_id) VALUES
(5, 3);

-- Health & Wellness
INSERT INTO project_categories (project_id, category_id) VALUES
(6, 4);

-- creating the roles table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- inserting into the role table
INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');

-- creating user table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

alter table users
alter column role_id set not null;

CREATE TABLE project_volunteers (
    volunteer_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    project_id INTEGER NOT NULL,

    volunteered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_volunteer
        UNIQUE(user_id, project_id)
);