"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RxDashboard,
  RxArchive,
  RxBox,
  RxStar,
  RxPerson,
} from 'react-icons/rx';
import styles from './Sidebar.module.css'; // <-- 1. Import CSS Module

const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: RxDashboard },
  { name: 'Manage Orders', href: '/admin/orders', icon: RxArchive },
  { name: 'Manage Products', href: '/admin/products', icon: RxBox },
  { name: 'Manage Reviews', href: '/admin/review', icon: RxStar },
  { name: 'Manage Users', href: '/admin/users', icon: RxPerson },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}> {/* <-- 2. Dùng styles.className */}
      <div className={styles.sidebarLogo}>
        <h1 className={styles.logoText}>Flowershop</h1>
      </div>

      <nav className={styles.sidebarNav}>
        <p className={styles.menuTitle}>MENU</p>
        <ul className={styles.navList}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                  <Icon className={styles.navIcon} />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}