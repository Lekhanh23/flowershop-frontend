'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Phone, ChevronDown, Bell, LogOut, Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react';
import styles from './page.module.css';

// --- Data & Fallbacks ---
const FALLBACK_BESTSELLERS = [
  { id: 1, name: 'Bó hồng trắng tinh khôi', price: '500.000đ', imageUrl: '/images/product-white.jpg' },
  { id: 2, name: 'Bó Peony hồng lãng mạn', price: '750.000đ', imageUrl: '/images/product-pink.jpg' },
  { id: 3, name: 'Lẵng hoa ly trắng quý phái', price: '680.000đ', imageUrl: '/images/product-lily.jpg' },
];

const FALLBACK_COLLECTIONS = [
  { id: 1, name: 'Anniversary', title: 'Kỷ niệm', imageUrl: '/images/collection-anniversary.jpg' },
  { id: 2, name: 'Birthday Flowers', title: 'Hoa sinh nhật', imageUrl: '/images/collection-birthday.jpg' },
  { id: 3, name: 'Graduation Flowers', title: 'Hoa tốt nghiệp', imageUrl: '/images/collection-graduation.jpg' },
  { id: 4, name: 'Everyday Flowers', title: 'Hoa hàng ngày', imageUrl: '/images/collection-everyday.jpg' },
  { id: 5, name: 'Summer Flowers', title: 'Hoa mùa hè', imageUrl: '/images/collection-summer.jpg' },
];

const FOOTER_SHOP_LINKS = [
  { href: "/bouquets", label: "All Bouquets" },
  { href: "/signature", label: "Signature Bouquets" },
  { href: "/preserved", label: "Preserved Roses" },
  { href: "/roses", label: "Roses" },
  { href: "/gifts", label: "Flowers and Gifts" },
];

const FOOTER_ABOUT_LINKS = [
  { href: "/admin/users/customers/about%20us", label: "About Us" },
  { href: "/admin/users/customers/meet%20our%20team", label: "Our Team" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
];

const FOOTER_SAME_DAY_DELIVERY = [
  "Cau Giay", "Ba Dinh", "Dong Da", "Tay Ho", "Thanh Xuan", "Nam Tu Liem", "Bac Tu Liem", "Ha Dong",
];

const FOOTER_NEXT_DAY_DELIVERY = [
  "Hoai Duc", "Hai Duong", "Son Tay", "Ha Nam", "Dan Phuong", "Ninh Binh", "Chuong My", "Hung Yen", "Thach That", "Soc Son",
];

// --- Header Component ---
const Header = () => {
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const collectionDropdownRef = useRef<HTMLDivElement>(null);
  const storyDropdownRef = useRef<HTMLDivElement>(null);
  
  const collectionItems = [
    { label: 'All Collections', href: '/admin/users/customers/collection' },
    { label: 'Birthday', href: '/admin/users/customers/collection/birthday' },
    { label: 'Anniversary', href: '/admin/users/customers/collection/anniversary' },
    { label: 'Congratulations', href: '/admin/users/customers/collection/congratulations' },
    { label: "Parent's Day", href: '/admin/users/customers/collection/parents-day' },
    { label: "Teacher's Day", href: '/admin/users/customers/collection/teachers-day' },
    { label: "International Women's Day", href: '/admin/users/customers/collection/women-day' },
  ];

  const storyItems = [
    { label: 'About Us', href: '/admin/users/customers/about%20us' },
    { label: 'Our Team', href: '/admin/users/customers/meet%20our%20team' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(event.target as Node)) {
        setIsCollectionOpen(false);
      }
      if (storyDropdownRef.current && !storyDropdownRef.current.contains(event.target as Node)) {
        setIsStoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <nav className="hidden lg:flex space-x-8">
          <Link href="/admin/users/customers/collection" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
            BOUQUET
          </Link>
          
          <div className="relative group" ref={collectionDropdownRef}
               onMouseEnter={() => setIsCollectionOpen(true)}
               onMouseLeave={() => setIsCollectionOpen(false)}>
            <button
              onClick={() => setIsCollectionOpen(!isCollectionOpen)}
              className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <span>COLLECTION</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className={`absolute left-0 mt-0 w-56 bg-white border border-gray-200 shadow-lg transition-all duration-300 origin-top ${
              isCollectionOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
            }`}>
              {collectionItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors ${
                    index === 0 ? 'border-b border-gray-200 font-semibold' : ''
                  }`}
                  onClick={() => setIsCollectionOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative group" ref={storyDropdownRef}
               onMouseEnter={() => setIsStoryOpen(true)}
               onMouseLeave={() => setIsStoryOpen(false)}>
            <button
              onClick={() => setIsStoryOpen(!isStoryOpen)}
              className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <span>OUR STORY</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className={`absolute left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg transition-all duration-300 origin-top ${
              isStoryOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
            }`}>
              {storyItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  onClick={() => setIsStoryOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-1 lg:flex-none text-center">
          <Link href="/" className="text-2xl font-serif tracking-widest text-pink-700 font-bold">
            Shop
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-pink-600" />
            <span className="hidden md:inline">Call Us:</span>
            <span className="font-semibold">1900 1234</span>
          </div>
          
          <button className="relative p-1 text-gray-700 hover:text-pink-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-pink-600 cursor-pointer transition-colors" />
          
          <Link href="/sign-in" className="p-1 text-gray-700 hover:text-pink-600 transition-colors">
            <User className="w-5 h-5" />
          </Link>
          
          <button className="p-1 text-gray-700 hover:text-pink-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

// --- Product Card Component ---
const ProductCard = ({ name, price, imageUrl }: { name: string; price: string; imageUrl: string }) => {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <button className="text-white opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/80 text-xs font-semibold px-4 py-2 transition-opacity duration-300">
            Quick View
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="text-sm font-light text-gray-800 hover:underline">{name}</h3>
        <p className="text-sm font-semibold text-gray-900 mt-1">{price}</p>
      </div>
    </div>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <footer className="bg-[#F5E0E0] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-8">
          <div className="w-full lg:w-1/5">
            <div className="w-36 h-36 relative">
              <Image src="/images/logo-blossom.png" alt="Blossom" fill className="object-contain" />
            </div>
          </div>

          <div className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_SHOP_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-pink-700 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_ABOUT_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-pink-700 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Same-day Delivery</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_SAME_DAY_DELIVERY.map((link) => (
                  <li key={link}><Link href={`/delivery/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-pink-700">{link}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Next-day Delivery</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_NEXT_DAY_DELIVERY.map((link) => (
                  <li key={link}><Link href={`/delivery/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-pink-700">{link}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-1/6 flex justify-end items-start">
            <div className="flex space-x-4 items-center text-gray-800">
              <Instagram className="w-6 h-6" />
              <Facebook className="w-6 h-6" />
              <Twitter className="w-6 h-6" />
              <Youtube className="w-6 h-6" />
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-pink-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-xs text-gray-700">
            <div className="hidden md:flex space-x-6">
              <Link href="/sitemap" className="hover:text-pink-700">Sitemap</Link>
              <Link href="/accessibility" className="hover:text-pink-700">Accessibility Statement</Link>
              <Link href="/terms" className="hover:text-pink-700">Term & Condition</Link>
              <Link href="/privacy" className="hover:text-pink-700">Privacy Policy</Link>
            </div>
            <div className="text-center text-xs text-gray-600">© {new Date().getFullYear()} Blossom Flower Shop</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Component ---
export default function HomePage() {
  const [bestsellers, setBestsellers] = useState(FALLBACK_BESTSELLERS);
  const [collections, setCollections] = useState(FALLBACK_COLLECTIONS);

  useEffect(() => {
    // Load bestsellers from API
    const loadBestsellers = async () => {
      try {
        const res = await fetch('/api/products?bestseller=1');
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (rows.length > 0) {
          setBestsellers(rows.map((r: any) => ({ id: r.id, name: r.name, price: r.price, imageUrl: r.imageUrl })));
        }
      } catch (err) {
        console.warn('Could not load bestsellers from API:', err);
      }
    };

    // Load collections from API
    const loadCollections = async () => {
      try {
        const res = await fetch('/api/collections');
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (rows.length > 0) {
          setCollections(rows.map((r: any) => ({ id: r.id, name: r.name, title: r.title, imageUrl: r.imageUrl })));
        }
      } catch (err) {
        console.warn('Could not load collections from API:', err);
      }
    };

    loadBestsellers();
    loadCollections();
  }, []);

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Flower Shop</h1>
            <p className={styles.heroSubtitle}>Simple & Elegant.</p>
            <p className={styles.heroDescription}>
              Hãy tặng một bó hoa đặc biệt để chia sẻ câu chuyện tuyệt vời của riêng bạn.
              Chúng tôi giao hoa tươi và thiết kế thủ công.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.heroPrimaryBtn}>Shop Now</button>
              <button className={styles.heroSecondaryBtn}>Read More</button>
            </div>
            <p className={styles.heroDiscount}>* Get a discount on your first purchase</p>
          </div>

          <div className={styles.heroImage}>
            <Image 
              src="/images/hero-banner.jpg" 
              alt="Bó hoa cưới sang trọng" 
              fill 
              priority
              className="object-cover object-center absolute inset-0" 
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className={styles.heroImagePlaceholder}>Shop It Now</div>
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
            <Link href="/bestsellers" className={styles.viewAllBtn}>View all</Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className={styles.collectionsSection}>
        <h2 className={styles.collectionSectionTitle}>
          <span className={styles.collectionDecorator}>✵</span>
          <span className={styles.collectionTitleText}>SHOP BY OUR COLLECTIONS</span>
          <span className={styles.collectionDecorator}>✵</span>
        </h2>

        <div className={styles.collectionGrid}>
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              href={`/collection/${collection.name.toLowerCase().replace(' ', '-')}`} 
              className={styles.collectionCard}
            >
              <div className={styles.collectionCardImage}>
                <Image 
                  src={collection.imageUrl} 
                  alt={collection.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
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
        <h2 className={styles.contentSectionTitle}>ABOUT FLOWER DELIVERY WITH (SHOP NAME)</h2>
        <p className={styles.contentSectionDescription}>
          Gửi một câu hỏi đặc biệt hoặc gửi một thông điệp chu đáo
          với một bó hoa ấn tượng.
        </p>

        <div className={styles.accordionContainer}>
          <div className={styles.accordionItem}>
            <h3 className={styles.accordionItemTitle}>Types of Flower Bouquets We Offer</h3>
          </div>
          <div className={styles.accordionItem}>
            <h3 className={styles.accordionItemTitle}>Why Order Flowers from [Shop name]?</h3>
          </div>
          <div className={styles.accordionItem}>
            <h3 className={styles.accordionItemTitle}>Frequently Asked Questions About Rose Flower Delivery</h3>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
