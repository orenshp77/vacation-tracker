import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

class FollowerModel {
    async follow(userId: number, vacationId: number): Promise<boolean> {
        try {
            await pool.execute<ResultSetHeader>(
                'INSERT INTO followers (user_id, vacation_id) VALUES (?, ?)',
                [userId, vacationId]
            );
            return true;
        } catch (error: any) {
            // Duplicate entry - already following
            if (error.code === 'ER_DUP_ENTRY') {
                return false;
            }
            throw error;
        }
    }

    async unfollow(userId: number, vacationId: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM followers WHERE user_id = ? AND vacation_id = ?',
            [userId, vacationId]
        );

        return result.affectedRows > 0;
    }

    async isFollowing(userId: number, vacationId: number): Promise<boolean> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT 1 FROM followers WHERE user_id = ? AND vacation_id = ?',
            [userId, vacationId]
        );

        return rows.length > 0;
    }

    async getFollowedVacationIds(userId: number): Promise<number[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT vacation_id FROM followers WHERE user_id = ?',
            [userId]
        );

        return rows.map(row => row.vacation_id);
    }
}

export default new FollowerModel();
