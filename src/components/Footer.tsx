'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';
import styles from './Footer.module.css';

// Data
const SHOP_LINKS = [
  { label: "All Bouquets", href: "/bouquets" },
  { label: "Signature Bouquets", href: "/signature" },
  { label: "Preserved Roses", href: "/preserved" },
  { label: "Roses", href: "/roses" },
  { label: "Flowers and Gifts", href: "/gifts" },
];
const ABOUT_LINKS = [
  { label: "Our Story", href: "/customer/about_us" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Your Account", href: "/profile" },
  { label: "FAQ", href: "/faq" },
  { label: "Where We Deliver", href: "/delivery" },
];
const SAME_DAY_DELIVERY_COL1 = ["Cau Giay", "Dong Da", "Thanh Xuan", "Nam Tu Liem", "Bac Tu Liem", "Ha Dong"];
const SAME_DAY_DELIVERY_COL2 = ["Ba Dinh", "Tay Ho"];
const NEXT_DAY_DELIVERY_COL1 = ["Hoai Duc", "Son Tay", "Dan Phuong", "Chuong My", "Thach That", "Soc Son"];
const NEXT_DAY_DELIVERY_COL2 = ["Hai Duong", "Ha Nam", "Ninh Binh", "Hung Yen"];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* TOP ROW */}
        <div className={styles.topRow}>
          {/* Logo */}
          <div>
             <img src="/images/logo.png" alt="Blossom Flower Shop" className={styles.logoImage} />
          </div>

          {/* Social Icons */}
          <div className={styles.socials}>
            <a href="#" className={`${styles.socialLink} ${styles.insta}`}><Instagram size={16} /></a>
            <a href="#" className={`${styles.socialLink} ${styles.facebook}`}><Facebook size={16} /></a>
            <a href="#" className={`${styles.socialLink} ${styles.twitter}`}>
              <span className={styles.xIcon}>X</span>
            </a>
            <a href="#" className={`${styles.socialLink} ${styles.youtube}`}><Youtube size={16} /></a>
            <a href="#" className={`${styles.socialLink} ${styles.mail}`}><Mail size={16} /></a>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className={styles.mainGrid}>
          
          {/* COL 1: SHOP */}
          <div>
            <h3 className={styles.columnTitle}>Shop</h3>
            <ul className={styles.columnList}>
              {SHOP_LINKS.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.linkItem}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 2: ABOUT */}
          <div>
            <h3 className={styles.columnTitle}>About</h3>
            <ul className={styles.columnList}>
              {ABOUT_LINKS.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.linkItem}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: SAME-DAY DELIVERY */}
          <div>
            <h3 className={styles.columnTitle}>Same-day Delivery</h3>
            <div className={styles.deliveryColumns}>
              <ul className={styles.columnList}>
                {SAME_DAY_DELIVERY_COL1.map(place => <li key={place}>{place}</li>)}
              </ul>
              <ul className={styles.columnList}>
                {SAME_DAY_DELIVERY_COL2.map(place => <li key={place}>{place}</li>)}
              </ul>
            </div>
          </div>

          {/* COL 4: NEXT-DAY DELIVERY */}
          <div>
            <h3 className={styles.columnTitle}>Next-day Delivery</h3>
            <div className={styles.deliveryColumns}>
              <ul className={styles.columnList}>
                {NEXT_DAY_DELIVERY_COL1.map(place => <li key={place}>{place}</li>)}
              </ul>
              <ul className={styles.columnList}>
                {NEXT_DAY_DELIVERY_COL2.map(place => <li key={place}>{place}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM LINKS */}
        <div className={styles.bottomBar}>
          <Link href="/sitemap" className={styles.bottomLink}>Sitemap</Link>
          <Link href="/accessibility" className={styles.bottomLink}>Accessibility Statement</Link>
          <Link href="/terms" className={styles.bottomLink}>Term & Condition</Link>
          <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};