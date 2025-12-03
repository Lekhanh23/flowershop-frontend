'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Phone, ChevronDown, Bell, LogOut, Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react';
import styles from './page.module.css';

const COLLECTIONS = [
  { id: 1, name: 'All Occasions', title: 'All Occasions', imageUrl: '/images/collection-all.jpg' },
  { id: 2, name: 'Birthday', title: 'Birthday', imageUrl: '/images/collection1.jpg' },
  { id: 3, name: 'Anniversary', title: 'Anniversary', imageUrl: '/images/collection2.jpg' },
  { id: 4, name: 'Congratulation', title: 'Congratulation', imageUrl: '/images/collection3.jpg' },
  { id: 5, name: "Parent's Day", title: "Parent's Day", imageUrl: '/images/collection4.jpg' },
  { id: 6, name: "Teacher's Day", title: "Teacher's Day", imageUrl: '/images/collection5.jpg' },
  { id: 7, name: "International Women's Day", title: "International Women's Day", imageUrl: '/images/collection6.jpg' },
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
  "Cau Giay", "Ba Dinh", 
  "Dong Da", "Tay Ho", 
  "Thanh Xuan", "Nam Tu Liem", 
  "Bac Tu Liem", "Ha Dong",
];

const FOOTER_NEXT_DAY_DELIVERY = [
  "Hoai Duc", "Hai Duong", 
  "Son Tay", "Ha Nam", 
  "Dan Phuong", "Ninh Binh", 
  "Chuong My", "Hung Yen", 
  "Thach That", "Soc Son",
];

export default function CollectionPage() {
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
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/admin/users/customers/homepage" className={styles.logo}>
            <span>Blossom</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/bouquet" className={styles.navItem}>BOUQUET</Link>

            <div className={styles.dropdownWrapper} ref={collectionDropdownRef}
                 onMouseEnter={() => setIsCollectionOpen(true)}
                 onMouseLeave={() => setIsCollectionOpen(false)}>
              <button
                onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                className={styles.navItem}
              >
                COLLECTION
                <ChevronDown className={styles.chevron} />
              </button>

              <div className={`${styles.dropdown} ${isCollectionOpen ? styles.dropdownOpen : ''}`}>
                {collectionItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`${styles.dropdownItem} ${index === 0 ? styles.dropdownItemTop : ''}`}
                    onClick={() => setIsCollectionOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.dropdownWrapper} ref={storyDropdownRef}
                 onMouseEnter={() => setIsStoryOpen(true)}
                 onMouseLeave={() => setIsStoryOpen(false)}>
              <button
                onClick={() => setIsStoryOpen(!isStoryOpen)}
                className={styles.navItem}
              >
                OUR STORY
                <ChevronDown className={styles.chevron} />
              </button>

              <div className={`${styles.dropdown} ${isStoryOpen ? styles.dropdownOpen : ''}`}>
                {storyItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={styles.dropdownItem}
                    onClick={() => setIsStoryOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className={styles.headerRight}>
            <span className={styles.phone}>
              <Phone className={styles.phoneIcon} />
              CALL US: +84 9001090
            </span>
            <Bell className={styles.icon} />
            <ShoppingCart className={styles.icon} />
            <User className={styles.icon} />
            <button className={styles.logoutBtn}>
              <LogOut className={styles.logoutIcon} />
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Collection Tabs */}
      <div className={styles.tabsContainer}>
        {COLLECTIONS.map((collection, index) => (
          <button key={index} className={`${styles.tab} ${index === 0 ? styles.tabActive : ''}`}>
            {collection.title}
          </button>
        ))}
      </div>

      {/* Main Title */}
      <div className={styles.mainTitleSection}>
        <h1 className={styles.mainTitle}>EXPLORE OUR FLOWER COLLECTION<br />FOR ALL OCCASIONS</h1>
      </div>

      {/* Collections Grid */}
      <div className={styles.collectionsGrid}>
        {COLLECTIONS.map((collection, index) => (
          <div key={index} className={styles.collectionCard}>
            <div className={styles.collectionImageWrapper}>
              <img
                src={collection.imageUrl}
                alt={collection.title}
                className={styles.collectionImage}
              />
              <div className={styles.collectionOverlay}>
                <div className={styles.collectionLabel}>COLLECTIONS</div>
                <div className={styles.collectionName}>{collection.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Shop</h3>
            {FOOTER_SHOP_LINKS.map((link, idx) => (
              <Link key={idx} href={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>About</h3>
            {FOOTER_ABOUT_LINKS.map((link, idx) => (
              <Link key={idx} href={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Same-day Delivery</h3>
            {FOOTER_SAME_DAY_DELIVERY.map((link) => (
              <Link key={link} href={`/delivery/${link.toLowerCase().replace(' ', '-')}`} className={styles.footerLink}>
                {link}
              </Link>
            ))}
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Next-day Delivery</h3>
            {FOOTER_NEXT_DAY_DELIVERY.map((link) => (
              <Link key={link} href={`/delivery/${link.toLowerCase().replace(' ', '-')}`} className={styles.footerLink}>
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.socialIcons}>
            <Link href="https://instagram.com" target="_blank" className={styles.socialIcon}>
              <Instagram />
            </Link>
            <Link href="https://facebook.com" target="_blank" className={styles.socialIcon}>
              <Facebook />
            </Link>
            <Link href="https://twitter.com" target="_blank" className={styles.socialIcon}>
              <Twitter />
            </Link>
            <Link href="https://youtube.com" target="_blank" className={styles.socialIcon}>
              <Youtube />
            </Link>
          </div>

          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
            <Link href="mailto:hello@flowershop.com" className={styles.bottomLink}>
              <Mail className={styles.mailIcon} />
              hello@flowershop.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
