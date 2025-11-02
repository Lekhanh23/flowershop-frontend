import { query } from '@/lib/database';
import { User } from './definitions';

/**
 * Lấy tất cả người dùng từ database, trừ mật khẩu.
 * Sắp xếp theo ID.
 */
export async function fetchAllUsers(): Promise<User[]> {
    try {
        const sql = `
            SELECT id, full_name, email, phone, address, role
            FROM users
            ORDER BY id ASC
        `;
        
        const users = await query(sql) as User[];
        return users;
    } catch (error) {
        console.error('Database Error: Failed to fetch users.', error);
        throw new Error('Failed to fetch user data.');
    }
}