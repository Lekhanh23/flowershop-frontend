import { query } from '@/lib/database';
import { Review, ReviewsSearchParams } from './definitions';

// Số lượng reviews trên mỗi trang được đọc từ biến môi trường.
// Dùng fallback là 10 nếu biến môi trường không được định nghĩa.
const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE) || 10;

export async function fetchFilteredReviews(searchParams: ReviewsSearchParams, currentPage: number): Promise<{ reviews: Review[], totalPages: number }> {
    // ITEMS_PER_PAGE đã được định nghĩa ở trên
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // 1. Xây dựng điều kiện WHERE
    let whereClauses: string[] = [];
    let params: any[] = [];

    // ... (Phần logic xây dựng WHERE CLAUSES giữ nguyên)

    // Lọc theo User name/email
    if (searchParams.userNameOrEmail) {
        whereClauses.push(" (u.full_name LIKE ? OR u.email LIKE ?) ");
        params.push(`%${searchParams.userNameOrEmail}%`);
        params.push(`%${searchParams.userNameOrEmail}%`);
    }

    // Lọc theo Product name
    if (searchParams.productName) {
        whereClauses.push(" p.name LIKE ? ");
        params.push(`%${searchParams.productName}%`);
    }

    // Lọc theo Date
    if (searchParams.date && searchParams.date !== 'dd/mm/yyyy') {
        const [day, month, year] = searchParams.date.split('/');
        const sqlDate = `${year}-${month}-${day}`;
        whereClauses.push(" DATE(r.created_at) = ? ");
        params.push(sqlDate);
    }

    // Lọc theo Rating
    if (searchParams.rating && searchParams.rating !== 'Rating') {
        whereClauses.push(" r.rating = ? ");
        params.push(parseInt(searchParams.rating));
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // 2. Query chính để lấy Reviews (có LIMIT/OFFSET)
    const reviewsSql = `
        SELECT 
            r.id, r.user_id, r.product_id, r.rating, r.comment, r.created_at,
            u.full_name as user_full_name, u.email as user_email,
            p.name as product_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN products p ON r.product_id = p.id
        ${whereString}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
    `;

    // 3. Query để tính tổng số trang (Total Pages - KHÔNG dùng LIMIT/OFFSET)
    const countSql = `
        SELECT COUNT(r.id) as count
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN products p ON r.product_id = p.id
        ${whereString}
    `;
    
    // Gộp tham số cho 2 query
    const reviewParams = [...params, ITEMS_PER_PAGE, offset]; // Thêm LIMIT và OFFSET
    const countParams = [...params]; // Giữ nguyên tham số filter

    try {
        const [reviewsResult, countResult] = await Promise.all([
            query(reviewsSql, reviewParams) as Promise<Review[]>,
            query(countSql, countParams) as Promise<{ count: number }[]>,
        ]);

        // **LOGIC QUAN TRỌNG:** Tổng số review được lấy từ COUNT query
        const totalReviews = Number(countResult[0].count);
        // Tổng số trang = Math.ceil(Tổng số review / Số review trên 1 trang)
        const totalPages = Math.ceil(totalReviews / ITEMS_PER_PAGE); 

        // ... (Phần format reviews giữ nguyên)

        const formattedReviews = reviewsResult.map(review => ({
            ...review,
            created_at: new Date(review.created_at).toLocaleString('en-CA', { 
                year: 'numeric', month: '2-digit', day: '2-digit', 
                hour: '2-digit', minute: '2-digit', hour12: false 
            }).replace(',', ' ') as unknown as Date,
        }));

        return {
            reviews: formattedReviews,
            totalPages,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch reviews data.');
    }
}