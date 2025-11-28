"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { RxDashboard, RxArchive, RxBox, RxStar, RxPerson, RxChevronDown, RxStack } from 'react-icons/rx';
import styles from './Sidebar.module.css';

// Cấu trúc menu hỗ trợ children
const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: RxDashboard },
  { name: 'Manage Orders', href: '/admin/orders', icon: RxArchive },
  { name: 'Manage Products', href: '/admin/products', icon: RxBox },
  { name: 'Manage Collections', href: '/admin/collections', icon: RxStack },
  { name: 'Manage Reviews', href: '/admin/review', icon: RxStar },
  { 
    name: 'Manage Users', 
    href: '/admin/users', 
    icon: RxPerson,
    children: [
      { name: 'Admins', href: '/admin/users/admins' },
      { name: 'Customers', href: '/admin/users/customers' },
      { name: 'Shippers', href: '/admin/users/shippers' },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  // State quản lý mở/đóng menu con
  // Mặc định mở nếu đang ở trong trang con của users
  const [openMenu, setOpenMenu] = useState<string | null>(
    pathname.includes('/admin/users') ? 'Manage Users' : null
  );

  const toggleMenu = (name: string) => {
    setOpenMenu(prev => (prev === name ? null : name));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
          <img src={"/images/logo.png"} alt='Flowershop Logo' className={styles.logoImg}></img>
      </div>

      <nav className={styles.sidebarNav}>
        <p className={styles.menuTitle}>MENU</p>
        <ul className={styles.navList}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const hasChildren = link.children && link.children.length > 0;
            const isOpen = openMenu === link.name;
            const isActiveParent = pathname.startsWith(link.href);

            return (
              <li key={link.name}>
                {hasChildren ? (
                  // --- MENU CÓ DROPDOWN ---
                  <div>
                    <div 
                      className={`${styles.navLink} ${isActiveParent ? styles.active : ''}`} 
                      onClick={() => toggleMenu(link.name)}
                      style={{cursor: 'pointer'}}
                    >
                      <Icon className={styles.navIcon} />
                      <span>{link.name}</span>
                      <RxChevronDown className={`${styles.arrowIcon} ${isOpen ? styles.open : ''}`} />
                    </div>
                    
                    {/* Render menu con */}
                    {isOpen && (
                      <ul className={styles.subMenu}>
                        {link.children.map((child) => (
                          <li key={child.name}>
                            <Link 
                              href={child.href}
                              className={`${styles.subLink} ${pathname === child.href ? styles.active : ''}`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // --- MENU THƯỜNG ---
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                  >
                    <Icon className={styles.navIcon} />
                    <span>{link.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}