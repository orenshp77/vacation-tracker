import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
}

class UserModel {
    async findByEmail(email: string): Promise<User | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) return null;

        return {
            id: rows[0].id,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            email: rows[0].email,
            password: rows[0].password,
            role: rows[0].role
        };
    }

    async findById(id: number): Promise<UserResponse | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
            [id]
        );

        if (rows.length === 0) return null;

        return {
            id: rows[0].id,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            email: rows[0].email,
            role: rows[0].role
        };
    }

    async create(user: User): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [user.firstName, user.lastName, user.email, user.password, user.role || 'user']
        );

        return result.insertId;
    }

    async emailExists(email: string): Promise<boolean> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        return rows.length > 0;
    }
}

export default new UserModel();
