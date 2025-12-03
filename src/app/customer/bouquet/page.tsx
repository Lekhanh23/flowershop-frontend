"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu khớp với dữ liệu trả về từ API
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;     // Đường dẫn ảnh từ database
  description?: string;
  isBestSeller?: boolean; // Nếu DB không có cột này, logic bên dưới sẽ tự ẩn badge "Best Seller"
}

export default function BouquetPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- GỌI API TỪ BACKEND ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // TODO: Đảm bảo Backend (NestJS) đang chạy ở port 3000 và đã có route GET /products
        const response = await fetch('http://localhost:3000/api/products');
        
        if (!response.ok) {
          throw new Error(`Lỗi kết nối: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dữ liệu nhận được từ API:", data); // Log để kiểm tra cấu trúc
        setProducts(data);
      } catch (err: any) {
        console.error("Không thể tải danh sách hoa:", err);
        setError(err.message || "Đã có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      {/* Breadcrumb nhỏ phía trên */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt; <span>All Bouquets</span>
      </div>

      {/* HEADER SECTION */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>ALL BOUQUETS</h1>
        <p className={styles.subtitle}>
          We design bouquets the French way, using seasons and our Parisian roots as inspiration.
        </p>
      </div>

      <div className={styles.layoutWrapper}>
        {/* --- LEFT SIDEBAR (FILTER) --- */}
        <div className={styles.sidebar}>
          <div className={styles.totalCount}>{products.length} bouquets</div>
          <div className={styles.filterTitle}>FILTER</div>

          {/* Các nhóm filter - Giữ nguyên giao diện tĩnh */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <span>Price</span>
              <span className={styles.arrow}>⌄</span>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <span>Occasion</span>
              <span className={styles.arrow}>⌄</span>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <span>Type</span>
              <span className={styles.arrow}>⌄</span>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <span>Color</span>
              <span className={styles.arrow}>⌄</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT CONTENT (PRODUCT GRID) --- */}
        <div className={styles.mainContent}>
          
          {/* Xử lý các trạng thái Loading / Error / Empty */}
          {loading && (
            <p style={{textAlign: 'center', marginTop: '50px', color: '#666'}}>
              Đang tải danh sách hoa...
            </p>
          )}

          {error && (
            <p style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>
              {error} <br/> 
              <small>Hãy chắc chắn rằng Backend đang chạy tại http://localhost:3000</small>
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p style={{textAlign: 'center', marginTop: '50px'}}>
              Chưa có sản phẩm nào.
            </p>
          )}

          {/* Hiển thị danh sách sản phẩm */}
          {!loading && !error && products.length > 0 && (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  {/* Image Container */}
                  <div className={styles.imageWrapper}>
                    {/* Sử dụng ảnh fallback nếu link ảnh lỗi hoặc rỗng */}
                    <img 
                      src={product.image || "https://placehold.co/400x500?text=No+Image"} 
                      alt={product.name} 
                      className={styles.productImage} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Error";
                      }}
                    />
                    
                    {/* Tên sản phẩm nằm đè lên ảnh góc trái trên */}
                    <span className={styles.productNameOnImage}>{product.name}</span>
                    
                    {/* Icon trái tim góc phải dưới */}
                    <button className={styles.heartBtn}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Info bên dưới ảnh */}
                  <div className={styles.productInfo}>
                    {/* Chỉ hiện Best Seller nếu trong DB có cột isBestSeller = true */}
                    {product.isBestSeller && (
                      <div className={styles.bestSeller}>
                        <span className={styles.starIcon}>✪</span> Best Seller
                      </div>
                    )}
                    
                    <div className={styles.price}>
                      From {Number(product.price).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.footerIcon}>
             <div className={styles.mailIcon}>✉</div>
          </div>
        </div>
      </div>
    </div>
  );
}