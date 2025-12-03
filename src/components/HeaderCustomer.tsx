'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Phone, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './HeaderCustomer.module.css';

export const HeaderCustomer = () => {
  const { logout } = useAuth();
  
  // State quản lý hover cho cả 2 menu
  const [isCollectionHover, setIsCollectionHover] = useState(false);
  const [isStoryHover, setIsStoryHover] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* LEFT: LOGO */}
        <div className={styles.logoWrapper}>
          <Link href="/customer/homepage">
            <div className={styles.logoBox}>
               <img 
                 src="/images/logo.png" 
                 alt="Blossom Flower Shop" 
                 className={styles.logoImage}
               />
            </div>
          </Link>
        </div>

        {/* CENTER: NAVIGATION */}
        <nav className={styles.nav}>
          <div className={styles.navItemWrapper}>
            <Link href="/customer/bouquet" className={styles.navLink}>
              Bouquet
            </Link>
          </div>

          {/* COLLECTION DROPDOWN */}
          <div 
            className={styles.navItemWrapper}
            onMouseEnter={() => setIsCollectionHover(true)}
            onMouseLeave={() => setIsCollectionHover(false)}
          >
            <Link href="/customer/collection" className={styles.navLink}>
              Collection
            </Link>
            
            {isCollectionHover && (
              <div className={styles.dropdownMenu}>
                <Link href="/customer/collection" className={styles.dropdownItem}>All collections</Link>
                <Link href="/customer/collection/birthday" className={styles.dropdownItem}>Birthday</Link>
                <Link href="/customer/collection/anniversary" className={styles.dropdownItem}>Anniversary</Link>
                <Link href="/customer/collection/congratulations" className={styles.dropdownItem}>Congratulations</Link>
                <Link href="/customer/collection/parents-day" className={styles.dropdownItem}>Parent's Day</Link>
                <Link href="/customer/collection/teachers-day" className={styles.dropdownItem}>Teacher's Day</Link>
                <Link href="/customer/collection/internationals-day" className={styles.dropdownItem}>International's Day</Link>
              </div>
            )}
          </div>

          {/* OUR STORY DROPDOWN */}
          <div 
            className={styles.navItemWrapper}
            onMouseEnter={() => setIsStoryHover(true)}
            onMouseLeave={() => setIsStoryHover(false)}
          >
            <Link href="/customer/about_us" className={styles.navLink}>
              Our Story
            </Link>

            {isStoryHover && (
              <div className={styles.dropdownMenu}>
                <Link href="/customer/about_us" className={styles.dropdownItem}>About Us</Link>
                <Link href="/customer/meet_our_team" className={styles.dropdownItem}>Our Team</Link>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: CONTACT & ICONS */}
        <div className={styles.rightSection}>
          <div className={styles.phoneWrapper}>
            <div className={styles.phoneIconBox}>
               <Phone className={styles.phoneIcon} />
            </div>
            <div className={styles.phoneInfo}>
               <span className={styles.callToOrder}>CALL TO ORDER</span>
               <span className={styles.phoneNumber}>+84 9001090</span>
            </div>
          </div>

          <div className={styles.iconsWrapper}>
            <button className={styles.iconBtn}>
              <Bell className={styles.iconSize} />
              <span className={styles.notificationDot}></span>
            </button>
            
            <Link href="/customer/cart" className={styles.iconBtn}>
              <ShoppingCart className={styles.iconSize} />
            </Link>
            
            <Link href="/customer/profile" className={styles.iconBtn}>
              <User className={styles.iconSize} />
            </Link>

            <button onClick={logout} className={styles.logoutBtn}>
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};