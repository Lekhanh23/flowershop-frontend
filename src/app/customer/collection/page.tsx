"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import styles from './page.module.css';
import { getImageUrl, formatPrice } from '@/lib/utils';

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

export default function CollectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy ID từ URL. Nếu không có thì mặc định là 'all'
  const paramId = searchParams.get('id');
  const initialTab = paramId && paramId !== 'all' ? Number(paramId) : 'all';

  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // State Active Tab được đồng bộ với URL
  const [activeTab, setActiveTab] = useState<number | 'all'>(initialTab);
  const [activeTabName, setActiveTabName] = useState("All Occasions");
  const [loading, setLoading] = useState(true);

  // 1. Lấy danh sách MENU (Collections)
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/collections');
        const data = await res.json();
        const colList = Array.isArray(data) ? data : (data.data || []);
        setCollections(colList);

        // Cập nhật tên Tab ban đầu nếu có ID từ URL
        if (initialTab !== 'all') {
            const found = colList.find((c: any) => c.id === initialTab);
            if (found) setActiveTabName(found.name);
        }
      } catch (error) {
        console.error("Lỗi tải menu:", error);
      }
    };
    fetchCollections();
  }, []); // Chỉ chạy 1 lần khi mount

  // 2. Lắng nghe sự thay đổi của URL để cập nhật Active Tab
  useEffect(() => {
    const currentId = searchParams.get('id');
    const newTab = currentId && currentId !== 'all' ? Number(currentId) : 'all';
    
    setActiveTab(newTab);
    
    // Cập nhật lại tên khi URL đổi (cần danh sách collections đã load)
    if (collections.length > 0) {
        if (newTab === 'all') {
            setActiveTabName("All Occasions");
        } else {
            const found = collections.find(c => c.id === newTab);
            if (found) setActiveTabName(found.name);
        }
    }
  }, [searchParams, collections]); // Chạy khi URL hoặc danh sách collection thay đổi

  // 3. Fetch sản phẩm khi Active Tab thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:3000/api/products?limit=100';
        
        if (activeTab !== 'all') {
          url += `&collection_id=${activeTab}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  // Hàm xử lý khi bấm Tab 
  const handleTabClick = (id: number | 'all') => {
    if (id === 'all') {
        router.push('/customer/collection'); 
    } else {
        router.push(`/customer/collection?id=${id}`); 
    }
  };

  return (
    <div className={styles.container}>
      
      {/* MENU TABS */}
      <div className={styles.tabsWrapper}>
        <button 
          className={`${styles.tabItem} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => handleTabClick('all')}
        >
          All Collections
        </button>

        {collections.map(col => (
          <button
            key={col.id}
            className={`${styles.tabItem} ${activeTab === col.id ? styles.tabActive : ''}`}
            onClick={() => handleTabClick(col.id)}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* TITLE */}
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>
          EXPLORE OUR FLOWER COLLECTION<br />
          FOR {activeTabName.toUpperCase()}
        </h1>
      </div>

      {/* PRODUCT GRID */}
      <div className={styles.productGrid}>
        {loading ? (
          <p className={styles.loadingText}>Loading flowers...</p>
        ) : products.length === 0 ? (
          <p className={styles.emptyText}>No products found for this occasion.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Link href={`/customer/products/${product.id}`}>
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
              <p className={styles.price}>{formatPrice(product.price)}</p> 
            </div>
          ))
        )}
      </div>
    </div>
  );
}