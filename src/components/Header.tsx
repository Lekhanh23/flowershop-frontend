"use client";

import { useAuth } from '@/context/AuthContext';
import { RxMagnifyingGlass, RxAvatar } from 'react-icons/rx';
import { FaBell } from 'react-icons/fa';
import styles from './Header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleLogout =async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }
  return (
    <header className={styles.header}> 
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

          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}