import mariadb from 'mariadb';

// Tạo connection pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flowershop',
    connectionLimit: 5,
    // Cấu hình thêm nếu cần
});

export async function query(sql: string, params: any[] = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sql, params);
        return res;
    } catch (err) {
        console.error("Database query error:", err);
        throw new Error("Failed to execute database query.");
    } finally {
        if (conn) conn.release();
    }
}