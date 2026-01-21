import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Vacation {
    id?: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageName: string;
}

export interface VacationWithFollowers extends Vacation {
    followersCount: number;
    isFollowing: boolean;
}

class VacationModel {
    async getAll(userId: number, isAdmin: boolean): Promise<VacationWithFollowers[]> {
        const query = `
            SELECT
                v.id,
                v.destination,
                v.description,
                v.start_date as startDate,
                v.end_date as endDate,
                v.price,
                v.image_name as imageName,
                COUNT(DISTINCT f.user_id) as followersCount,
                ${isAdmin ? '0' : 'MAX(CASE WHEN f.user_id = ? THEN 1 ELSE 0 END)'} as isFollowing
            FROM vacations v
            LEFT JOIN followers f ON v.id = f.vacation_id
            GROUP BY v.id
            ORDER BY v.start_date ASC
        `;

        const params = isAdmin ? [] : [userId];
        const [rows] = await pool.execute<RowDataPacket[]>(query, params);

        return rows.map(row => ({
            id: row.id,
            destination: row.destination,
            description: row.description,
            startDate: row.startDate,
            endDate: row.endDate,
            price: row.price,
            imageName: row.imageName,
            followersCount: row.followersCount,
            isFollowing: Boolean(row.isFollowing)
        }));
    }

    async getById(id: number): Promise<Vacation | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT id, destination, description, start_date as startDate,
             end_date as endDate, price, image_name as imageName
             FROM vacations WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) return null;

        return rows[0] as Vacation;
    }

    async create(vacation: Vacation): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO vacations (destination, description, start_date, end_date, price, image_name)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [vacation.destination, vacation.description, vacation.startDate,
             vacation.endDate, vacation.price, vacation.imageName]
        );

        return result.insertId;
    }

    async update(id: number, vacation: Partial<Vacation>): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];

        if (vacation.destination !== undefined) {
            fields.push('destination = ?');
            values.push(vacation.destination);
        }
        if (vacation.description !== undefined) {
            fields.push('description = ?');
            values.push(vacation.description);
        }
        if (vacation.startDate !== undefined) {
            fields.push('start_date = ?');
            values.push(vacation.startDate);
        }
        if (vacation.endDate !== undefined) {
            fields.push('end_date = ?');
            values.push(vacation.endDate);
        }
        if (vacation.price !== undefined) {
            fields.push('price = ?');
            values.push(vacation.price);
        }
        if (vacation.imageName !== undefined) {
            fields.push('image_name = ?');
            values.push(vacation.imageName);
        }

        if (fields.length === 0) return false;

        values.push(id);

        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE vacations SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        // Delete followers first (cascade)
        await pool.execute('DELETE FROM followers WHERE vacation_id = ?', [id]);

        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM vacations WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    }

    async getFollowersReport(): Promise<{ destination: string; followers: number }[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT v.destination, COUNT(f.user_id) as followers
            FROM vacations v
            LEFT JOIN followers f ON v.id = f.vacation_id
            GROUP BY v.id, v.destination
            ORDER BY v.destination
        `);

        return rows.map(row => ({
            destination: row.destination,
            followers: row.followers
        }));
    }
}

export default new VacationModel();
