"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

// --- CẤU HÌNH ĐƯỜNG DẪN ẢNH ---
// Backend chạy ở port 3000. 
// Backend cần "static serve" folder img ra đường dẫn /img
const BACKEND_URL = 'http://localhost:3000';
const IMAGE_BASE_URL = `${BACKEND_URL}/img/`;

// 1. Định nghĩa kiểu dữ liệu
interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // Tên file trong DB (ví dụ: "hoa-hong.jpg")
  description?: string;
  isBestSeller?: boolean;
  occasion?: string; 
}

// Kiểu dữ liệu cho bộ lọc
interface FilterState {
  priceRange: string | null;
  occasion: string[];
}

export default function BouquetPage() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State quản lý UI
  const [expandedFilter, setExpandedFilter] = useState<string | null>('price'); 

  // State quản lý Logic Filter
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    occasion: []
  });

  // --- GỌI API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/products`);
        
        if (!response.ok) throw new Error(`Lỗi kết nối: ${response.statusText}`);

        const data = await response.json();
        
        // Xử lý data trả về (phòng trường hợp API trả về { data: [...] } hoặc [...])
        const productsArray = Array.isArray(data) ? data : data.data || [];
        setProducts(productsArray);

      } catch (err: any) {
        console.error("Lỗi:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH ---
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "https://placehold.co/400x500?text=No+Image";
    
    // Nếu trong DB đã lưu full link (vd: https://imgur.com/...) thì dùng luôn
    if (imageName.startsWith('http')) return imageName;

    // Nếu chỉ lưu tên file (vd: "rose.jpg") thì nối với đường dẫn backend
    // Kết quả sẽ là: http://localhost:3000/img/rose.jpg
    
    // Xử lý trường hợp DB lưu có sẵn dấu '/' ở đầu hoặc không
    const cleanName = imageName.startsWith('/') ? imageName.slice(1) : imageName;
    
    return `${IMAGE_BASE_URL}${cleanName}`;
  };

  // --- HÀM XỬ LÝ FILTER UI (Đóng/Mở) ---
  const toggleFilterUI = (section: string) => {
    setExpandedFilter(expandedFilter === section ? null : section);
  };

  // --- HÀM XỬ LÝ LOGIC FILTER ---
  const handlePriceChange = (range: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range
    }));
  };

  const handleOccasionChange = (occ: string) => {
    setFilters(prev => {
      const exists = prev.occasion.includes(occ);
      return {
        ...prev,
        occasion: exists 
          ? prev.occasion.filter(o => o !== occ) 
          : [...prev.occasion, occ] 
      };
    });
  };

  // --- LOGIC LỌC SẢN PHẨM ---
  const displayedProducts = products.filter(p => {
    // 1. Lọc theo giá
    if (filters.priceRange === 'under500' && p.price >= 500000) return false;
    if (filters.priceRange === '500to1000' && (p.price < 500000 || p.price > 1000000)) return false;
    if (filters.priceRange === 'above1000' && p.price <= 1000000) return false;

    // 2. Lọc theo Occasion
    if (filters.occasion.length > 0 && p.occasion) {
       if (!filters.occasion.includes(p.occasion.toLowerCase())) return false;
    }

    return true;
  });

  // --- RENDER ---
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt; <span>All Bouquets</span>
      </div>

      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>ALL BOUQUETS</h1>
        <p className={styles.subtitle}>
          We design bouquets the French way, using seasons and our Parisian roots as inspiration.
        </p>
      </div>

      <div className={styles.layoutWrapper}>
        {/* --- SIDEBAR --- */}
        <div className={styles.sidebar}>
          <div className={styles.totalCount}>{displayedProducts.length} bouquets</div>
          <div className={styles.filterTitle}>FILTER</div>

          {/* 1. Price Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader} onClick={() => toggleFilterUI('price')}>
              <span>Price</span>
              <span className={styles.arrow}>{expandedFilter === 'price' ? '−' : '+'}</span>
            </div>
            {expandedFilter === 'price' && (
              <div className={styles.filterContent}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={filters.priceRange === 'under500'}
                    onChange={() => handlePriceChange('under500')}
                  /> 
                  Under 500.000đ
                </label>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={filters.priceRange === '500to1000'}
                    onChange={() => handlePriceChange('500to1000')}
                  /> 
                  500.000đ - 1.000.000đ
                </label>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={filters.priceRange === 'above1000'}
                    onChange={() => handlePriceChange('above1000')}
                  /> 
                  Above 1.000.000đ
                </label>
              </div>
            )}
          </div>

          {/* 2. Occasion Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader} onClick={() => toggleFilterUI('occasion')}>
              <span>Occasion</span>
              <span className={styles.arrow}>{expandedFilter === 'occasion' ? '−' : '+'}</span>
            </div>
            {expandedFilter === 'occasion' && (
              <div className={styles.filterContent}>
                {['Birthday', 'Anniversary', 'Love'].map((occ) => (
                  <label key={occ} className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={filters.occasion.includes(occ.toLowerCase())}
                      onChange={() => handleOccasionChange(occ.toLowerCase())}
                    /> 
                    {occ}
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {/* Nút Reset Filter */}
          {(filters.priceRange || filters.occasion.length > 0) && (
             <button 
               className={styles.resetBtn}
               onClick={() => setFilters({ priceRange: null, occasion: [] })}
             >
               Clear Filters
             </button>
          )}
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className={styles.mainContent}>
          {loading && <p className={styles.statusText}>Đang tải danh sách hoa...</p>}
          
          {error && (
            <div className={styles.errorBox}>
              <p>{error}</p>
              <small>Vui lòng kiểm tra Server (Port 3000) đã bật chưa.</small>
            </div>
          )}

          {!loading && !error && displayedProducts.length === 0 && (
            <p className={styles.statusText}>Không tìm thấy sản phẩm nào phù hợp.</p>
          )}

          {!loading && !error && displayedProducts.length > 0 && (
            <div className={styles.productGrid}>
              {displayedProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    {/* Sử dụng hàm getImageUrl để lấy link ảnh từ backend */}
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      className={styles.productImage} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Error+Loading";
                      }}
                    />
                    <span className={styles.productNameOnImage}>{product.name}</span>
                    <button className={styles.heartBtn}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  <div className={styles.productInfo}>
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
        </div>
      </div>
    </div>
  );
}