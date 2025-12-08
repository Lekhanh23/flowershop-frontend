"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css";

type Notification = {
  id: number;
  type: string;
  message: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/shipper/notifications")
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
            setNotifs(res.data.data);
        } else {
            setNotifs([]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
        case 'order_status':
        case 'shipper_assignment':
            return (
                <div className={`${styles.icon} ${styles.iconOrder}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
            );
        case 'admin_message':
            return (
                <div className={`${styles.icon} ${styles.iconAdmin}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
            );
        default:
            return (
                <div className={`${styles.icon} ${styles.iconSystem}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
            );
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải thông báo...</div>;

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Thông báo</h1>

        {notifs.length === 0 ? (
            <div className={styles.empty}>Bạn chưa có thông báo nào.</div>
        ) : (
            <div className={styles.list}>
                {notifs.map(item => (
                    <div key={item.id} className={styles.item}>
                        {getIcon(item.type)}
                        <div className={styles.content}>
                            <div className={styles.message}>{item.message}</div>
                            <div className={styles.time}>
                                {new Date(item.createdAt).toLocaleString('vi-VN')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </main>
  );
}