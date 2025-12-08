"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "./page.module.css";

export default function ShipperDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, totalDelivered: 0, totalIncome: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/shipper/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        
        {/* HEADER */}
        <div className={styles.welcomeSection}>
            <h1 className={styles.title}>Xin chào, {user?.full_name}! 👋</h1>
            <p className={styles.subtitle}>Tổng quan hoạt động giao hàng của bạn.</p>
        </div>

        {/* CARDS */}
        <div className={styles.grid}>
            {/* Pending */}
            <Link href="/shipper/assigned" className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <span className={styles.cardLabel}>Đơn cần giao</span>
                        <div className={`${styles.cardValue} ${styles.textPink}`}>{stats.pending}</div>
                    </div>
                    <div className={`${styles.iconBox} ${styles.bgPink}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                </div>
                <div className={styles.cardFooter}>Xem danh sách &rarr;</div>
            </Link>

            {/* Delivered */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <span className={styles.cardLabel}>Tổng đơn đã giao</span>
                        <div className={`${styles.cardValue} ${styles.textGreen}`}>{stats.totalDelivered}</div>
                    </div>
                    <div className={`${styles.iconBox} ${styles.bgGreen}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div className={styles.cardFooter}>Tất cả thời gian</div>
            </div>

            {/* Income */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <span className={styles.cardLabel}>Tổng thu nhập (10%)</span>
                        <div className={`${styles.cardValue} ${styles.textBlue}`}>
                            {Number(stats.totalIncome).toLocaleString()}đ
                        </div>
                    </div>
                    <div className={`${styles.iconBox} ${styles.bgBlue}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                </div>
                <div className={styles.cardFooter}>Hoa hồng tích lũy</div>
            </div>
        </div>

        {/* ACTION */}
        <div className={styles.actionBox}>
            <div>
                <h3 className={styles.actionTitle}>Trạng thái hoạt động</h3>
                <p className={styles.actionDesc}>Đảm bảo bạn đang ONLINE để nhận đơn mới.</p>
            </div>
            <Link href="/shipper/profile" className={styles.checkBtn}>
                Kiểm tra
            </Link>
        </div>

      </div>
    </main>
  );
}