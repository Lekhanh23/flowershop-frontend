"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Header } from "../../../components/HeaderCustomer";
import { Footer } from "@/components/Footer";
import styles from "./page.module.css";

// Helper format date: dd/mm/yyyy hh:mm
const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    
    const d = new Date(dateStr);
    
    // Kiểm tra nếu ngày không hợp lệ
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', ''); 
    // Kết quả sẽ là: 27/11/2025 16:25
  };

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/admin/notifications?limit=50');
      setNotifs(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this notification?")) return;
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifs(prev => prev.filter((n: any) => n.id !== id));
    } catch (e) { alert("Failed to delete"); }
  };

  if (loading) return (
    <div>
      <Header />
      <div className={styles.container}>Loading notifications...</div>
      <Footer />
    </div>
  );
  console.log("Data Notification:", notifs);

  if (notifs.length === 0) {
    return (
      <div>
        <Header />
        <div className={styles.container}>
          <h1 className={styles.title}>Notifications</h1>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔔</div>
            <p className={styles.emptyText}>You have no notifications.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
      <h1 className={styles.title}>Notifications</h1>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>User</th>
              <th>Target User</th>
              <th>Product</th>
              <th>Order</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notifs.map((n: any) => (
              <tr key={n.id}>
                <td className={styles.idCell}>{n.id}</td>
                <td><span className={styles.typeCell}>{n.type}</span></td>
                <td>
                  <span className={styles.userName}>{n.user?.full_name || 'System'}</span>
                  {n.user?.email && <span className={styles.userEmail}>{n.user.email}</span>}
                </td>
                <td>
                  <span className={styles.userName}>{n.targetUser?.full_name || '-'}</span>
                  {n.targetUser?.email && <span className={styles.userEmail}>{n.targetUser.email}</span>}
                </td>
                <td>{n.product ? `#${n.product.id}` : '-'}</td>
                <td>{n.order ? `#${n.order.id}` : '-'}</td>
                <td className={styles.messageCell}>{n.message}</td>
                <td className={styles.dateCell}>{formatDate(n.createdAt)}</td>
                <td className={styles.actionCell}>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(n.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <Footer />
    </div>
  );
}
