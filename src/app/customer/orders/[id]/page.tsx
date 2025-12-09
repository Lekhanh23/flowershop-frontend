"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { getImageUrl, formatPrice } from '@/lib/utils';
import styles from './page.module.css';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        // API này đã có sẵn trong OrdersController (getMyOrder)
        const res = await api.get(`/orders/my-orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Loading order details...</div>;
  if (!order) return <div style={{padding: 40, textAlign: 'center'}}>Order not found</div>;

  const isDelivered = order.status === 'delivered';

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/customer/profile" className={styles.backLink}>← Back to Profile</Link>
        <h1 className={styles.title}>Order #{order.id}</h1>
        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
          {order.status}
        </span>
      </div>

      {/* Thông tin chung */}
      <div className={styles.infoGrid}>
        <div className={styles.infoBox}>
          <h3>Order Date</h3>
          <p>{new Date(order.order_date || order.created_at).toLocaleDateString('vi-VN')}</p>
        </div>
        <div className={styles.infoBox}>
          <h3>Total Amount</h3>
          <p className={styles.totalPrice}>{formatPrice(order.total_amount)}</p>
        </div>
        <div className={styles.infoBox}>
            <h3>Shipper</h3>
            <p>{order.shipper ? order.shipper.full_name : "Đang cập nhật"}</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className={styles.itemsSection}>
        <h2 className={styles.sectionTitle}>Items in your order</h2>
        <div className={styles.itemList}>
          {order.orderItems.map((item: any) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemImage}>
                <img 
                  src={getImageUrl(item.product.image)} 
                  alt={item.product.name} 
                  onError={(e) => e.currentTarget.src = "https://placehold.co/100x100?text=Img"}
                />
              </div>
              
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.product.name}</h4>
                <p className={styles.itemMeta}>
                  Qty: {item.quantity} x {formatPrice(item.price)}
                  {item.service && <span className={styles.serviceTag}> + {item.service.name}</span>}
                </p>
              </div>

              <div className={styles.itemAction}>
                {/* CHỈ HIỆN NÚT REVIEW KHI ĐÃ GIAO HÀNG */}
                {isDelivered && (
                  <Link 
                    href={`/customer/reviews/write?product_id=${item.product.id}`}
                    className={styles.reviewBtn}
                  >
                    ★ Write a Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}