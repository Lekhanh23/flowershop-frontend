// src/lib/database.ts
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "flowershop",
  connectionLimit: 5,
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);

    // mariadb library trả thêm metadata ở cuối (nếu có), ta lọc ra mảng thuần
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error("Database query error:", err);
    throw new Error("Failed to execute database query.");
  } finally {
    if (conn) conn.release();
  }
}
