"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css"; // Import CSS Module

export default function OrdersPage() {
  // Khởi tạo mảng rỗng để tránh lỗi map undefined
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/admin/all");
        
        // Kiểm tra cấu trúc trả về từ NestJS
        if (res.data && Array.isArray(res.data.data)) {
            setOrders(res.data.data);
        } else if (Array.isArray(res.data)) {
            setOrders(res.data);
        } else {
            setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper để chọn class màu cho status
  const getStatusClass = (status: string) => {
    switch (status) {
        case 'delivered': return styles.statusDelivered;
        case 'shipped': return styles.statusShipped;
        case 'cancelled': return styles.statusCancelled;
        default: return styles.statusPending;
    }
  };

  if (loading) return <div className={styles.loading}>Loading data...</div>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Order Management</h1>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>       
              <th>Order ID</th>  
              <th>Customer</th>  
              <th>Total</th>     
              <th>Shipper</th>   
              <th>Status</th>    
              <th>Date</th>      
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
                <tr>
                    <td colSpan={7} className={styles.empty}>
                        No orders found.
                    </td>
                </tr>
            ) : (
                orders.map((o: any, index: number) => (
                <tr key={o.id}>
                    <td className={styles.stt}>{index + 1}</td>
                    <td className={styles.id}>#{o.id}</td>
                    <td>
                        <span className={styles.customerName}>{o.user?.full_name}</span>
                        <span className={styles.customerPhone}>{o.user?.phone}</span>
                    </td>
                    <td className={styles.total}>
                        {Number(o.total_amount).toLocaleString()}đ
                    </td>
                    <td>
                        {o.shipper ? (
                            <span className={styles.shipperName}>{o.shipper.full_name}</span>
                        ) : (
                            <span className={styles.shipperUnassigned}>Unassigned</span>
                        )}
                    </td>
                    <td>
                        <span className={`${styles.badge} ${getStatusClass(o.status)}`}>
                            {o.status}
                        </span>
                    </td>
                    <td className={styles.date}>
                        {/* Hiển thị ngày tháng theo chuẩn quốc tế hoặc VN tuỳ bạn chọn */}
                        {new Date(o.order_date || o.created_at).toLocaleDateString('en-GB')}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}