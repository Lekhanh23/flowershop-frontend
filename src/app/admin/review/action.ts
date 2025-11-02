'use server';

import { query } from '@/lib/database';
import { revalidatePath } from 'next/cache';

/**
 * Xóa một đánh giá dựa trên ID
 * @param id ID của đánh giá cần xóa
 */
export async function deleteReview(id: number) {
    try {
        const sql = `DELETE FROM reviews WHERE id = ?`;
        await query(sql, [id]);

        // Cần revalidate lại cache của trang để hiển thị dữ liệu mới
        revalidatePath('/admin/reviews');
        return { success: true, message: 'Review deleted successfully.' };
    } catch (error) {
        console.error('DELETE Review Error:', error);
        return { success: false, message: 'Failed to delete review.' };
    }
}