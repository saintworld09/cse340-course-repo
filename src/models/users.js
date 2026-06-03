import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Create a new user
 */
const createUser = async (name, email, passwordHash) => {
    const sql = `
        INSERT INTO users
        (name, email, password_hash, role_id)
        VALUES
        ($1, $2, $3, 1)
        RETURNING *;
    `;

    const result = await db.query(sql, [
        name,
        email,
        passwordHash
    ]);

    return result.rows[0];
};

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
    const query = `
        SELECT 
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;

    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/**
 * Verify password
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticate user
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        return null;
    }

    delete user.password_hash;

    return user;
};


export async function getAllUsers() {
    const sql = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.user_id;
    `;

    const result = await db.query(sql);

    return result.rows;
}


export {
    createUser,
    authenticateUser
};