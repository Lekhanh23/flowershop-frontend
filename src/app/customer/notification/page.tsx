"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './page.module.css';

// Định nghĩa kiểu dữ liệu thông báo
interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  order_id?: number;
  // Các field khác nếu cần
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  // Helper chọn icon dựa theo loại thông báo
  const getIcon = (type: string) => {
    switch (type) {
      case 'order_status': return '📦';
      case 'admin_message': return '📢';
      case 'login': return '🔑';
      case 'review': return '⭐';
      default: return '🔔';
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Gọi API Backend vừa tạo
        const res = await api.get('/notifications/my');
        // Backend trả về { data: [], total: ... }
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setNotifs(list);
      } catch (error) {
        console.error("Lỗi tải thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Notifications</h1>
        <Link href="/customer/profile" className={styles.backLink}>← Back to Profile</Link>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading notifications...</div>
        ) : notifs.length === 0 ? (
          <div className={styles.empty}>
            <p>You have no notifications yet.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {notifs.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.iconWrapper}>
                  {getIcon(item.type)}
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemMessage}>{item.message}</div>
                  <div className={styles.itemDate}>{formatDate(item.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}