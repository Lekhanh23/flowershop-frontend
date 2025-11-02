'use server';

import { query } from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { User } from './lib/definitions';

/**
 * Cập nhật thông tin người dùng trong database.
 * @param user Dữ liệu người dùng cần cập nhật.
 */
export async function updateUserDetails(user: Omit<User, 'password'>) {
    try {
        const sql = `
            UPDATE users
            SET full_name = ?, email = ?, phone = ?, address = ?, role = ?
            WHERE id = ?
        `;
        const params = [
            user.full_name,
            user.email,
            user.phone,
            user.address,
            user.role,
            user.id
        ];
        
        await query(sql, params);

        // Revalidate cache để trang hiển thị dữ liệu mới nhất
        revalidatePath('/admin/users'); 
        return { success: true, message: 'User updated successfully.' };

    } catch (error: any) {
        console.error('UPDATE User Error:', error);
        // Kiểm tra lỗi trùng email (UNIQUE KEY constraint)
        if (error.code === 'ER_DUP_ENTRY') { 
            return { success: false, message: 'Email already exists. Please use a different email.' };
        }
        return { success: false, message: 'Failed to update user details.' };
    }
}

/**
 * Xóa người dùng.
 * @param id ID của người dùng cần xóa.
 */
export async function deleteUser(id: number) {
    try {
        // Kiểm tra nếu là admin đang cố xóa admin khác, có thể thêm logic bảo vệ ở đây.
        // Ví dụ: Không cho xóa user có ID = 3 (Admin Flower)
        if (id === 3) {
             return { success: false, message: 'Cannot delete primary admin account.' };
        }
        
        const sql = `DELETE FROM users WHERE id = ?`;
        await query(sql, [id]);

        revalidatePath('/admin/users');
        return { success: true, message: 'User deleted successfully.' };
    } catch (error) {
        console.error('DELETE User Error:', error);
        return { success: false, message: 'Failed to delete user.' };
    }
}