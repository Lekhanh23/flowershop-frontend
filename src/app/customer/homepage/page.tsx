"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getImageUrl, formatPrice } from '@/lib/utils';


// --- Dữ liệu Bestsellers (Vẫn lấy từ SQL/Backend nên dùng tên file ngắn để getImageUrl xử lý) ---
const FALLBACK_BESTSELLERS = [
  { id: 1, name: 'Red Rose Bouquet', price: 450000, imageUrl: 'hoa1.png' },
  { id: 7, name: 'Peony Bloom', price: 580000, imageUrl: 'hoa2.png' },
  { id: 3, name: 'Sunflower Sunshine', price: 390000, imageUrl: 'hoa3.png' },
  { id: 12, name: 'Romantic Mixed Roses', price: 560000, imageUrl: 'hoa2.png' },
];

// --- Dữ liệu Collections (Ảnh nằm ở Frontend: public/images/...) ---
const FALLBACK_COLLECTIONS = [
  { id: 1, name: 'Birthday', title: 'Birthday', imageUrl: '/images/collection1.png' },
  { id: 2, name: 'Anniversary', title: 'Anniversary', imageUrl: '/images/collection2.png' },
  { id: 3, name: 'Congratulation', title: 'Congratulation', imageUrl: '/images/collection3.png' },
  { id: 4, name: "Parent's Day", title: "Parent's Day", imageUrl: '/images/collection4.png' },
  { id: 5, name: "Teacher's Day", title: "Teacher's Day", imageUrl: '/images/collection5.png' },
  { id: 6, name: "International Women's Day", title: "Women's Day", imageUrl: '/images/collection6.png' },
];

// --- Product Card Component (Dành cho sản phẩm - Vẫn dùng getImageUrl) ---
const ProductCard = ({ name, price, imageUrl }: { name: string; price: number | string; imageUrl: string }) => {
  // Sản phẩm lấy ảnh từ Backend nên cần getImageUrl
  const displayImage = getImageUrl(imageUrl); 

  return (
    <div className={styles.productCard}> 
      <div className="flex flex-col group cursor-pointer">
        <div className="relative aspect-[3/4] w-full overflow-hidden border border-gray-100 rounded-sm">
          <img 
            src={displayImage} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            onError={(e) => e.currentTarget.src = "https://via.placeholder.com/300x400?text=No+Image"}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <button className="text-white opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/80 text-xs font-semibold px-4 py-2 transition-opacity duration-300">
              Quick View
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-sm font-medium text-gray-800 hover:text-pink-600 transition-colors">{name}</h3>
          <p className="text-sm font-bold text-gray-900 mt-1">{typeof price === 'number' ? formatPrice(price) : price}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function HomePage() {
  const [bestsellers, setBestsellers] = useState(FALLBACK_BESTSELLERS);
  const [collections, setCollections] = useState(FALLBACK_COLLECTIONS);

  useEffect(() => {
    // 1. Load Bestsellers từ API (Backend)
    const loadBestsellers = async () => {
      try {
        const res = await fetch('/api/products?limit=4'); 
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (rows.length > 0) {
          setBestsellers(rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            price: r.price,
            imageUrl: r.image // API trả về tên file (vd: hoa1.png)
          })));
        }
      } catch (err) {
        console.warn('API error, using SQL fallback data for bestsellers.');
      }
    };

    // 2. Load Collections từ API (Nhưng map ảnh từ Frontend)
    const loadCollections = async () => {
      try {
        const res = await fetch('/api/collections?limit=6');
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        
        if (rows.length > 0) {
          setCollections(rows.map((r: any) => {
            const localImage = FALLBACK_COLLECTIONS.find(c => c.id === r.id)?.imageUrl || '/images/collection1.png';
            
            return {
              id: r.id,
              name: r.name,
              title: r.name,
              imageUrl: localImage 
            };
          }));
        }
      } catch (err) {
        console.warn('API error, using fallback data for collections.');
      }
    };

    loadBestsellers();
    loadCollections();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}><b>Blossom Flower Shop</b></h1>
            <p className={styles.heroSubtitle}>Simple & Elegant.</p>
            <p className={styles.heroDescription}>
            Welcome to our flower shop! Explore our beautiful collection of flowers. We offer a wide variety of fresh flowers for every occasion. From elegant roses to vibrant sunflowers, we have something for everyone.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/customer/collection" className={styles.heroPrimaryBtn}>Shop Now</Link>
              <button className={styles.heroSecondaryBtn}>Read More</button>
            </div>
            <p className={styles.heroDiscount}>* Get 10% discount on your first purchase</p>
          </div>

          <div className={styles.heroImage}>
            <div className="relative w-full h-full">
                <img 
                src="/images/home_banner.jpg" 
                alt="Banner" 
                className="object-cover w-full h-full rounded-lg shadow-lg"
                onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                />
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className={styles.bestsellersSection}>
        <h2 className={styles.sectionTitle}>Our Bestsellers</h2>
        
        <div className={styles.productGrid}>
          {bestsellers.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
          
          <div className={styles.viewAllCard}>
            <p className={styles.viewAllText}>
              Khám phá trọn bộ các sản phẩm bán chạy nhất của chúng tôi
            </p>
            <Link href="/customer/collection" className={styles.viewAllBtn}>View all</Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className={styles.collectionsSection}>
        <h2 className={styles.collectionSectionTitle}>
          <span className={styles.collectionDecorator}>✵</span>
          <span className={styles.collectionTitleText}>SHOP BY OCCASION</span>
          <span className={styles.collectionDecorator}>✵</span>
        </h2>

        <div className={styles.collectionGrid}>
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              href={`/customer/collection/${collection.id}`} 
              className={styles.collectionCard}
            >
              <div className={styles.collectionCardImage}>
                {/* Dùng trực tiếp collection.imageUrl vì đây là đường dẫn local (/images/...) */}
                <img 
                  src={collection.imageUrl} 
                  alt={collection.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => e.currentTarget.src = "https://via.placeholder.com/400x300?text=Collection"}
                />
              </div>
              <div className={styles.collectionCardOverlay}>
                <h3 className={styles.collectionCardTitle}>{collection.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <h2 className={styles.contentSectionTitle}>ABOUT BLOSSOM FLOWER SHOP</h2>
        <p className={styles.contentSectionDescription}>
        We don't just sell flowers, we deliver emotions. Each bouquet tells a story, a sincere message to the recipient.
        </p>

        <div className={styles.accordionContainer}>
          <div className={styles.accordionItem}>
            <h3 className={styles.accordionItemTitle}>Express flower delivery service within 2 hours</h3>
          </div>
          <div className={styles.accordionItem}>
            <h3 className={styles.accordionItemTitle}>100% fresh flower commitment within the day</h3>
          </div>
          <div className={styles.accordionItem}>
            <h3 className={styles.accordionItemTitle}>Free card and banner included</h3>
          </div>
        </div>
      </section>
    </div>
  );
}