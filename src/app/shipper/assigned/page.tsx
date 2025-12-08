"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "./page.module.css";

type Order = {
  id: number;
  total_amount: number;
  delivery_status: string;
  user: { full_name: string; phone: string; address: string };
  order_date: string;
};

export default function AssignedPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/shipper/assigned")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Đang tải...</div>;

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.headerTitle}>Đơn hàng cần giao ({orders.length})</h1>

        {orders.length === 0 ? (
            <div className={styles.emptyState}>Chưa có đơn hàng mới.</div>
        ) : (
            <div className={styles.list}>
                {orders.map(order => (
                    <div key={order.id} className={styles.card}>
                        <div className={styles.infoCol}>
                            <div className={styles.headerRow}>
                                <span className={styles.orderId}>#{order.id}</span>
                                <span className={styles.statusBadge}>
                                    {order.delivery_status?.replace('_', ' ') || 'Assigned'}
                                </span>
                                <span className={styles.date}>{new Date(order.order_date).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.address}>{order.user?.address || "Địa chỉ khách hàng"}</div>
                            <div className={styles.customer}>
                                {order.user?.full_name} • <span className={styles.phone}>{order.user?.phone}</span>
                            </div>
                        </div>
                        
                        <div className={styles.actionCol}>
                            <div className={styles.price}>
                                {Number(order.total_amount).toLocaleString()}đ
                            </div>
                            <Link href={`/shipper/orders/${order.id}`} className={styles.detailBtn}>
                                Chi tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </main>
  );
}