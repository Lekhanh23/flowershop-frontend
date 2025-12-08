"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

// --- CẤU HÌNH ---
const BACKEND_URL = 'http://localhost:3000';
const ITEMS_PER_PAGE = 6; 

// 1. Định nghĩa kiểu dữ liệu
interface Collection {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  isBestSeller?: boolean;
  // Hỗ trợ cả 2 trường hợp tên biến (do Backend có thể trả về camelCase hoặc snake_case)
  collection_id?: number; 
  collectionId?: number;
}

interface FilterState {
  priceRange: string | null;
  collectionIds: number[];
}

export default function BouquetPage() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]); 
  const [loading, setLoading] = useState(true);
  const [colLoading, setColLoading] = useState(true); // Loading riêng cho Collection
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [expandedFilter, setExpandedFilter] = useState<string | null>('price'); 
  const [currentPage, setCurrentPage] = useState(1);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    collectionIds: [] 
  });

  // --- GỌI API ---
  useEffect(() => {
    // 1. Hàm lấy Sản phẩm
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/products?limit=100`);
        if (!response.ok) throw new Error(`Products Error: ${response.statusText}`);
        
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.data || [];
        console.log("Products Loaded:", list); // Debug xem có collection_id không
        setProducts(list);
      } catch (err: any) {
        console.error("Lỗi tải SP:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 2. Hàm lấy Collections
    const fetchCollections = async () => {
      try {
        setColLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/collections`);
        if (!response.ok) throw new Error(`Collections Error: ${response.statusText}`);
        
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.data || [];
        console.log("Collections Loaded:", list); // Debug xem danh sách có rỗng không
        setCollections(list);
      } catch (err: any) {
        console.error("Lỗi tải Collections:", err);
        // Không set error chung để tránh chặn hiển thị sản phẩm
      } finally {
        setColLoading(false);
      }
    };

    fetchProducts();
    fetchCollections();
  }, []);

  // Reset trang khi filter đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // --- HÀM UI ---
  const toggleFilterUI = (section: string) => {
    setExpandedFilter(expandedFilter === section ? null : section);
  };

  // --- HÀM FILTER ---
  const handlePriceChange = (range: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range
    }));
  };

  const handleCollectionChange = (id: number) => {
    setFilters(prev => {
      const exists = prev.collectionIds.includes(id);
      return {
        ...prev,
        collectionIds: exists 
          ? prev.collectionIds.filter(cId => cId !== id) 
          : [...prev.collectionIds, id]
      };
    });
  };

  // --- 1. LOGIC LỌC DATA ---
  const filteredProducts = products.filter(p => {
    // A. Lọc theo giá
    if (filters.priceRange === 'under500' && p.price >= 500000) return false;
    if (filters.priceRange === '500to1000' && (p.price < 500000 || p.price > 1000000)) return false;
    if (filters.priceRange === 'above1000' && p.price <= 1000000) return false;

    // B. Lọc theo Collection
    if (filters.collectionIds.length > 0) {
       // Lấy ID chuẩn: ưu tiên collection_id, nếu không có thì lấy collectionId
       const pColId = p.collection_id || p.collectionId;
       
       // Nếu sản phẩm không thuộc collection nào hoặc ID không khớp -> Loại
       if (!pColId || !filters.collectionIds.includes(pColId)) {
         return false;
       }
    }
    return true;
  });

  // --- 2. PHÂN TRANG ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

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
        {/* --- SIDEBAR (FILTER) --- */}
        <div className={styles.sidebar}>
          <div className={styles.totalCount}>{filteredProducts.length} bouquets</div>
          <div className={styles.filterTitle}>FILTER</div>

          {/* Price Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader} onClick={() => toggleFilterUI('price')}>
              <span>Price</span>
              <span className={styles.arrow}>{expandedFilter === 'price' ? '−' : '+'}</span>
            </div>
            {expandedFilter === 'price' && (
              <div className={styles.filterContent}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={filters.priceRange === 'under500'} onChange={() => handlePriceChange('under500')} /> 
                  Under 500.000đ
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={filters.priceRange === '500to1000'} onChange={() => handlePriceChange('500to1000')} /> 
                  500.000đ - 1.000.000đ
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={filters.priceRange === 'above1000'} onChange={() => handlePriceChange('above1000')} /> 
                  Above 1.000.000đ
                </label>
              </div>
            )}
          </div>

          {/* Collection Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader} onClick={() => toggleFilterUI('collection')}>
              <span>Collections</span>
              <span className={styles.arrow}>{expandedFilter === 'collection' ? '−' : '+'}</span>
            </div>
            {expandedFilter === 'collection' && (
              <div className={styles.filterContent}>
                {colLoading ? (
                  <p style={{fontSize: 13, color: '#999', paddingLeft: 5}}>Loading...</p>
                ) : collections.length === 0 ? (
                  <p style={{fontSize: 13, color: '#999', paddingLeft: 5}}>No collections found.</p>
                ) : (
                  collections.map((col) => (
                    <label key={col.id} className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={filters.collectionIds.includes(col.id)}
                        onChange={() => handleCollectionChange(col.id)}
                      /> 
                      {col.name}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          
          {(filters.priceRange || filters.collectionIds.length > 0) && (
             <button className={styles.resetBtn} onClick={() => setFilters({ priceRange: null, collectionIds: [] })}>
               Clear Filters
             </button>
          )}
        </div>

        {/* --- MAIN CONTENT (PRODUCTS) --- */}
        <div className={styles.mainContent}>
          {loading && <p className={styles.statusText}>Loading products...</p>}
          
          {error && (
            <div className={styles.errorBox}>
              <p>Error: {error}</p>
              <small>Check if Backend Server is running at {BACKEND_URL}</small>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className={styles.statusText}>No products match your filter.</p>
          )}

<<<<<<< HEAD
          {!loading && !error && currentProducts.length > 0 && (
            <>
              {/* Product Grid */}
              <div className={styles.productGrid}>
                {currentProducts.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <Link href={`/customer/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className={styles.imageWrapper}>
                        <img 
                          src={getImageUrl(product.image)} 
                          alt={product.name} 
                          className={styles.productImage} 
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=No+Image"; }}
                        />
                        <span className={styles.productNameOnImage}>{product.name}</span>
                        
                        <button 
                          className={styles.heartBtn}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Liked", product.id);
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
=======
          {!loading && !error && displayedProducts.length > 0 && (
            <div className={styles.productGrid}>
              {displayedProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <Link href={`/customer/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    
                    <div className={styles.imageWrapper}>
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className={styles.productImage} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Error+Loading";
                        }}
                      />
                      <span className={styles.productNameOnImage}>{product.name}</span>
                      
                      {/* Nút tim (Yêu thích) - Cần chặn sự kiện click để không bị nhảy trang khi ấn tim */}
                      <button 
                        className={styles.heartBtn}
                        onClick={(e) => {
                          e.preventDefault(); // Chặn Link nhảy trang
                          e.stopPropagation(); // Chặn sự kiện nổi bọt
                          // Logic thêm vào yêu thích ở đây (nếu có)
                          console.log("Liked", product.id);
                        }}
                      >
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
>>>>>>> d04522bbca66abe8fc7f03fb365c8506178ec3f9
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
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    className={styles.pageBtn} 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt; Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`${styles.pageBtn} ${currentPage === index + 1 ? styles.active : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button 
                    className={styles.pageBtn} 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}