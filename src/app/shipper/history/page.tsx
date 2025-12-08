"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css";

type HistoryOrder = {
  id: number;
  total_amount: number;
  address: string;
  delivery_status: string;
  order_date: string;
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [range, setRange] = useState("30");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/shipper/history?days=${range}`)
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
            <h1 className={styles.title}>Lịch sử giao hàng</h1>
            <div className={styles.filterGroup}>
                {['7', '30', '90'].map(d => (
                    <button 
                        key={d}
                        onClick={() => setRange(d)}
                        className={`${styles.filterBtn} ${range === d ? styles.filterBtnActive : ''}`}
                    >
                        {d} ngày
                    </button>
                ))}
            </div>
        </div>

        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th style={{textAlign: 'right'}}>Tổng tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={5} style={{textAlign: 'center', padding: 30}}>Đang tải...</td></tr>
                    ) : orders.length === 0 ? (
                        <tr><td colSpan={5} style={{textAlign: 'center', padding: 30}}>Không có dữ liệu.</td></tr>
                    ) : (
                        orders.map(o => (
                            <tr key={o.id} className={styles.tableRow}>
                                <td><span className={styles.orderLink}>#{o.id}</span></td>
                                <td>{new Date(o.order_date).toLocaleDateString()}</td>
                                <td style={{maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    {o.address || '---'}
                                </td>
                                <td>
                                    <span className={`${styles.status} ${
                                        o.delivery_status === 'delivered' ? styles.statusDelivered : styles.statusFailed
                                    }`}>
                                        {o.delivery_status}
                                    </span>
                                </td>
                                <td className={styles.price}>{Number(o.total_amount).toLocaleString()}đ</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </main>
  );
}