"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
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

  if (loading) return <div className={styles.container}>Loading notifications...</div>;
  console.log("Data Notification:", notifs);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Notifications</h1>

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
                <td style={{ fontWeight: 'bold' }}>{n.id}</td>
                <td style={{ textTransform: 'capitalize', color: '#666' }}>{n.type}</td>
                <td>
                  <span className={styles.userName}>{n.user?.full_name || 'System'}</span>
                </td>
                <td>
                  <span className={styles.userName}>{n.targetUser?.full_name || '-'}</span>
                </td>
                <td>{n.product ? n.product.id : '-'}</td>
                <td>{n.order ? `#${n.order.id}` : '-'}</td>
                <td>{n.message}</td>
                <td style={{ color: '#666', fontSize: 13 }}>{formatDate(n.createdAt)}</td>
                <td>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(n.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}