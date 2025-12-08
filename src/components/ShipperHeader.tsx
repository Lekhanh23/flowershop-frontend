"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./ShipperHeader.module.css";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function ShipperHeader() {
  const { user, logout } = useAuth();
  const [available, setAvailable] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Load trạng thái từ API Profile
  useEffect(() => {
    async function load() {
      try {
        // Gọi API lấy profile để biết trạng thái hiện tại
        const res = await api.get("/shipper/profile");
        if (res.data) {
          setAvailable(res.data.status === 'available');
        }
      } catch (e) {
        console.error("Lỗi tải header", e);
      }
    }
    load();
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  // Hàm Toggle trạng thái
  async function toggleAvailable() {
    const nextState = !available;
    const statusEnum = nextState ? 'available' : 'unavailable';
    
    // Optimistic Update (Cập nhật UI trước cho nhanh)
    setAvailable(nextState);

    try {
      await api.patch("/shipper/profile/status", { status: statusEnum });
    } catch (e) {
      setAvailable(!nextState); // Revert nếu lỗi
      alert("Lỗi cập nhật trạng thái");
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* LOGO */}
        <div className={styles.logoWrapper}>
          <Link href="/shipper" className={styles.logoBox} aria-label="Shipper Home">
            <img src="/images/logo.png" alt="Logo" className={styles.logoImage} />
          </Link>
          <div className={styles.brandText}>
            <div className={styles.brandName}>Blossom</div>
            <div className={styles.brandSub}>Shipper</div>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className={styles.nav}>
          <Link href="/shipper/assigned" className={styles.navLink}>Assigned</Link>
          <Link href="/shipper/history" className={styles.navLink}>History</Link>
          <Link href="/shipper/profile" className={styles.navLink}>Profile</Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className={styles.right}>
          
          {/* Status Toggle */}
          <div className={`${styles.statusBox} ${available ? styles.statusBoxActive : ''}`}>
            <span className={styles.statusDot} style={{ background: available ? "#22c55e" : "#9ca3af" }} />
            <button onClick={toggleAvailable} className={styles.statusText}>
              {available ? "Active" : "Busy"}
            </button>
          </div>

          {/* User Info */}
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.full_name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className={styles.userDetails}>
                <div className={styles.userName}>{user?.full_name}</div>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        <div ref={menuRef} className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
          <div className={styles.mobileMenuInner}>
             <div className={styles.mobileUserInfo}>
                <div className={styles.mobileAvatar}>{user?.full_name?.charAt(0) || "S"}</div>
                <div>
                    <div className={styles.mobileName}>{user?.full_name}</div>
                    <div className={styles.mobileEmail}>{user?.email}</div>
                </div>
             </div>
             <hr className={styles.divider}/>
             <Link href="/shipper/assigned" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Assigned Orders</Link>
             <Link href="/shipper/history" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>History</Link>
             <Link href="/shipper/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Profile</Link>
             <hr className={styles.divider}/>
             <button className={`${styles.mobileLink} ${styles.logoutLink}`} onClick={() => { logout?.(); setMenuOpen(false); }}>
                Log Out
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}