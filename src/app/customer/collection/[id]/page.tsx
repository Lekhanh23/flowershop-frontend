"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getImageUrl, formatPrice } from '@/lib/utils'; // Giả định đã có

interface Collection {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Dữ liệu giả cho phần Bestsellers (cố định 4 sản phẩm)
const BESTSELLER_PRODUCTS: Product[] = [
  { id: 101, name: "Red Rose Bouquet", price: 450000, image: "bestseller/red_rose.jpg" },
  { id: 102, name: "Peony Bloom", price: 580000, image: "bestseller/peony_bloom.jpg" },
  { id: 103, name: "Sunflower Sunshine", price: 390000, image: "bestseller/sunflower.jpg" },
  { id: 104, name: "Romantic Mixed Roses", price: 560000, image: "bestseller/mixed_roses.jpg" },
];

// Component Bán Chạy Nhất (Bestsellers) - Tích hợp
const BestsellersSection = () => (
  <div className={styles.bestsellerContainer}>
    <h2 className={styles.bestsellerTitle}>Our Bestsellers</h2>
    <div className={styles.bestsellerGrid}>
      
      {/* 4 Sản phẩm Bestseller */}
      {BESTSELLER_PRODUCTS.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <Link href={`/customer/bouquet/${product.id}`}>
            <div className={styles.imageWrapper}>
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className={styles.productImage}
                onError={(e) => e.currentTarget.src = "https://placehold.co/400x500?text=No+Image"}
              />
            </div>
            <h3 className={styles.productName}>{product.name}</h3>
          </Link>
          <p className={styles.price}>{formatPrice(product.price)} VND</p>
        </div>
      ))}
      
      {/* Khối View All - Được căn giữa theo yêu cầu */}
      <div className={styles.viewAllBlock}>
        <p className={styles.viewAllText}>
          Khám phá trọn bộ các sản phẩm bán chạy nhất của chúng tôi
        </p>
        {/* Liên kết đến trang collection (giả sử đường dẫn là /collections) */}
        <Link href="/collections" className={styles.viewAllLink}>
          <button className={styles.viewAllButton}>
            View all
          </button>
        </Link>
      </div>
    </div>
  </div>
);


export default function CollectionPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // State quản lý tab đang chọn. Mặc định là 'all'
  const [activeTab, setActiveTab] = useState<number | 'all'>('all'); 
  const [activeTabName, setActiveTabName] = useState("All Occasions");
  const [loading, setLoading] = useState(true);

  // 1. Lấy danh sách Tabs (Menu)
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/collections');
        const data = await res.json();
        setCollections(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Lỗi tải menu:", error);
      }
    };
    fetchCollections();
  }, []);

  // 2. Lấy danh sách SẢN PHẨM dựa theo Tab đang chọn
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:3000/api/products?limit=100';
        
        // Nếu không phải "All Occasions", thêm tham số lọc theo ID
        if (activeTab !== 'all') {
          url += `&collection_id=${activeTab}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        // Backend trả về { data: [...] }
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]); // Chạy lại khi activeTab thay đổi

  // Hàm xử lý khi bấm vào Tab
  const handleTabClick = (id: number | 'all', name: string) => {
    setActiveTab(id);
    setActiveTabName(name);
  };

  return (
    <div className={styles.container}>
      
      {/* --- PHẦN MỚI: OUR BESTSELLERS --- */}
      <BestsellersSection />

      {/* --- PHẦN GỐC: COLLECTION TABS --- */}
      <div className={styles.tabsWrapper}>
        <button 
          className={`${styles.tabItem} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => handleTabClick('all', "All Occasions")}
        >
          All Occasions
        </button>

        {collections.map(col => (
          <button
            key={col.id}
            className={`${styles.tabItem} ${activeTab === col.id ? styles.tabActive : ''}`}
            onClick={() => handleTabClick(col.id, col.name)}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* --- TIÊU ĐỀ LỚN --- */}
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>
          EXPLORE OUR FLOWER COLLECTION<br />
          FOR {activeTabName.toUpperCase()}
        </h1>
      </div>

      {/* --- GRID SẢN PHẨM --- */}
      <div className={styles.productGrid}>
        {loading ? (
          <p className={styles.loadingText}>Loading flowers...</p>
        ) : products.length === 0 ? (
          <p className={styles.emptyText}>No products found for this occasion.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Link href={`/customer/bouquet/${product.id}`}>
                <div className={styles.imageWrapper}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className={styles.productImage}
                    onError={(e) => e.currentTarget.src = "https://placehold.co/400x500?text=No+Image"}
                  />
                </div>
                {/* Tên sản phẩm gạch chân hồng như thiết kế */}
                <h3 className={styles.productName}>{product.name}</h3>
              </Link>
              <p className={styles.price}>{formatPrice(product.price)}</p> 
            </div>
          ))
        )}
      </div>
    </div>
  );
}