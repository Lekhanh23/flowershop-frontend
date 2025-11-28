"use client";

import { useAuth } from '@/context/AuthContext';
import { RxMagnifyingGlass, RxAvatar } from 'react-icons/rx';
import { FaBell } from 'react-icons/fa';
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}> {/* <-- 2. Dùng styles.className */}
      <div className={styles.headerContent}>
        {/* Thanh Tìm kiếm */}
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>
            <RxMagnifyingGlass />
          </span>
          <input
            type="text"
            placeholder="Search or type command..."
            className={styles.searchInput}
          />
        </div>

        {/* Thông tin User và Logout */}
        <div className={styles.userSection}>
        <Link href="/admin/notifications">
             <FaBell className={styles.userIcon} style={{ cursor: 'pointer' }} />
        </Link>
          
          <div className={styles.userInfo}>
            <RxAvatar className={styles.userAvatar} />
            <span className={styles.userName}>
              Hi, {user?.full_name.split(' ')[0]}
            </span>
          </div>

          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}