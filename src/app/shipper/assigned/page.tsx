"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "./page.module.css";

type Order = {
  id: number;
  total_amount: number;
  deliveryStatus: string; // [FIX]: Sửa tên type
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

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải đơn hàng...</div>;

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.headerTitle}>Đơn hàng cần giao ({orders.length})</h1>

        {orders.length === 0 ? (
            <div className={styles.emptyState}>Không tìm thấy đơn hàng.</div>
        ) : (
            <div className={styles.list}>
                {orders.map(order => (
                    <div key={order.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <span className={styles.orderId}>#{order.id}</span>
                                {/* [FIX]: Dùng deliveryStatus */}
                                <span className={styles.statusBadge} style={{marginLeft: 8}}>
                                    {order.deliveryStatus?.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            <span className={styles.date}>
                                {new Date(order.order_date).toLocaleDateString('vi-VN')}
                            </span>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.address}>{order.user?.address || "Địa chỉ khách hàng"}</div>
                            <div className={styles.customer}>
                                {order.user?.full_name} • <span className={styles.phone}>{order.user?.phone}</span>
                            </div>
                        </div>
                        
                        <div className={styles.priceRow}>
                            <div className={styles.price}>
                                {Number(order.total_amount).toLocaleString()}đ
                            </div>
                        </div>

                        <Link href={`/shipper/orders/${order.id}`} className={styles.detailBtn}>
                            Chi tiết
                        </Link>
                    </div>
                ))}
            </div>
        )}
      </div>
    </main>
  );
}