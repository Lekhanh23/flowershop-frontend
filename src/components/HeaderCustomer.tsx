'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Phone, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './HeaderCustomer.module.css';

export const HeaderCustomer = () => {
  const { logout } = useAuth();
  
  // Không cần state hover phức tạp nữa vì đã xử lý bằng CSS :hover
  
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
          <div className={styles.navItemWrapper}>
            <Link href="/customer/collection" className={styles.navLink}>
              Collection
            </Link>
            
            <div className={styles.dropdownMenu}>
                <Link href="/customer/collection" className={styles.dropdownItem}>All collections</Link>
                <Link href="/customer/collection/1" className={styles.dropdownItem}>Birthday</Link>
                <Link href="/customer/collection/2" className={styles.dropdownItem}>Anniversary</Link>
                <Link href="/customer/collection/3" className={styles.dropdownItem}>Congratulations</Link>
                <Link href="/customer/collection/4" className={styles.dropdownItem}>Parent's Day</Link>
                <Link href="/customer/collection/5" className={styles.dropdownItem}>Teacher's Day</Link>
                <Link href="/customer/collection/6" className={styles.dropdownItem}>Women's Day</Link>
            </div>
          </div>

          {/* OUR STORY DROPDOWN */}
          <div className={styles.navItemWrapper}>
            <Link href="/customer/about_us" className={styles.navLink}>
              Our Story
            </Link>

            <div className={styles.dropdownMenu}>
                <Link href="/customer/about_us" className={styles.dropdownItem}>About Us</Link>
                <Link href="/customer/meet_our_team" className={styles.dropdownItem}>Our Team</Link>
            </div>
          </div>

          {/* CAREER DROPDOWN */}
          <div className={styles.navItemWrapper}>
            <Link href="/customer/career/join" className={styles.navLink}>
              Career
            </Link>

            <div className={styles.dropdownMenu}>
                <Link href="/customer/career/join" className={styles.dropdownItem}>
              Become a Shipper
            </Link>
            </div>
          </div>
        </nav>

        {/* RIGHT: CONTACT & ICONS */}
        <div className={styles.rightSection}>
          <div className={styles.phoneWrapper}>
            <div className={styles.phoneIconBox}>
               {/* Icon điện thoại tô đặc giống thiết kế */}
               <Phone fill="currentColor" className={styles.phoneIcon} />
            </div>
            <div className={styles.phoneInfo}>
               <span className={styles.callToOrder}>CALL TO ORDER</span>
               <span className={styles.phoneNumber}>+84 9001090</span>
            </div>
          </div>

          <div className={styles.iconsWrapper}>
            <Link href="/customer/notification" className={styles.iconBtn}>
              <Bell className={styles.iconSize} />
              <span className={styles.notificationDot}></span>
            </Link>
            
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