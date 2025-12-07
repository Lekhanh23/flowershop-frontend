"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./ShipperHeader.module.css";
import { useAuth } from "@/context/AuthContext";

export default function ShipperHeader() {
  const { user, logout } = useAuth();
  const [available, setAvailable] = useState(true);
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/shipper/status");
        if (res.ok) {
          const data = await res.json();
          if (typeof data.available === "boolean") setAvailable(data.available);
        }
      } catch {}
      try {
        const r2 = await fetch("/api/shipper/notifications/count");
        if (r2.ok) {
          const d = await r2.json();
          setCount(d.count ?? 0);
        }
      } catch {}
    }
    load();
  }, []);

  // close menu when clicking outside
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

  async function toggleAvailable(e?: React.MouseEvent) {
    e?.preventDefault();
    const next = !available;
    setAvailable(next);
    try {
      await fetch("/api/shipper/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: next }),
      });
    } catch {}
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo + Brand text */}
        <div className={styles.logoWrapper}>
          <Link href="/shipper" className={styles.logoBox} aria-label="Shipper Home">
            <img src="/images/logo.png" alt="Blossom Logo" className={styles.logoImage} />
          </Link>

          {/* Brand text - now always visible on mobile frame */}
          <div className={styles.brandText} style={{ display: "block" }}>
            <div className={styles.brandName}>Blossom Flower Shop</div>
            <div className={styles.brandSub}>Delivery</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Primary">
          <Link href="/shipper/assigned" className={styles.navLink}>Assigned</Link>
          <Link href="/shipper/history" className={styles.navLink}>History</Link>
          <Link href="/shipper/profile" className={styles.navLink}>Profile</Link>
        </nav>

        {/* Right side */}
        <div className={styles.right}>
          {/* Notifications (removed phone icon) */}
          <Link href="/shipper/assigned" className={`${styles.iconBtn} ${styles.badge}`} title="Notifications" aria-label="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 0 0-5-5.917V4a2 2 0 1 0-4 0v1.083A6 6 0 0 0 4 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            {count > 0 && <span className={styles.badgeCount}>{count}</span>}
          </Link>

          {/* Status badge */}
          <div className={styles.statusBox}>
            <span className={styles.statusDot} style={{ background: available ? "#22c55e" : "#cbd5e1" }} />
            <button onClick={toggleAvailable} className={`${styles.statusText} ${!available ? "busy" : ""}`}>
              {available ? "Available" : "Busy"}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>

          {/* User name */}
          <div className={styles.userName}>
            <div>{user?.name ?? "Shipper"}</div>
            <div className={styles.userPhone}>{user?.phone ?? ""}</div>
          </div>
        </div>

        {/* Mobile menu */}
        <div ref={menuRef} className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`} role="dialog" aria-hidden={!menuOpen}>
          <div className={styles.mobileMenuInner}>
            <Link href="/shipper/assigned" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Assigned</Link>
            <Link href="/shipper/history" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>History</Link>
            <Link href="/shipper/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Profile</Link>
            <button className={styles.mobileLink} onClick={() => { logout?.(); setMenuOpen(false); }}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}