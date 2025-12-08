"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import styles from "./page.module.css";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get(`/shipper/orders/${params.id}`)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleUpdateStatus = async (status: string, file?: File) => {
    const formData = new FormData();
    formData.append("status", status);
    if (file) formData.append("proof", file);

    setUploading(true);
    try {
        await api.post(`/shipper/orders/${params.id}/status`, formData);
        alert("Cập nhật thành công!");
        if (status === 'delivered') router.push('/shipper/assigned');
        else window.location.reload();
    } catch (e) {
        alert("Lỗi cập nhật.");
    } finally {
        setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        if (confirm("Xác nhận đã giao hàng thành công?")) {
            handleUpdateStatus("delivered", e.target.files[0]);
        }
    }
  };

  if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Loading...</div>;
  if (!order) return <div style={{padding: 40, textAlign: 'center'}}>Không tìm thấy đơn hàng.</div>;

  // Xử lý status theo logic database của bạn
  // Enum: assigned, picked_up, in_transit, delivered
  const currentStatus = order.delivery_status; 

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/shipper/assigned" className={styles.backLink}>&larr; Quay lại danh sách</Link>

        {/* INFO CARD */}
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div>
                    <h1 className={styles.orderTitle}>Đơn hàng #{order.id}</h1>
                    <div className={styles.orderTime}>{new Date(order.created_at || order.order_date).toLocaleString()}</div>
                </div>
                <span className={styles.statusBadge}>
                    {currentStatus?.replace('_', ' ')}
                </span>
            </div>
            
            <div className={styles.cardBody}>
                {/* Customer */}
                <div className={styles.infoBlock}>
                    <div className={styles.label}>Khách hàng</div>
                    <div className={styles.value}>{order.user?.full_name}</div>
                    <a href={`tel:${order.user?.phone}`} className={styles.link}>{order.user?.phone}</a>
                </div>

                {/* Address */}
                <div className={styles.infoBlock}>
                    <div className={styles.label}>Địa chỉ giao hàng</div>
                    <div className={styles.addressBox}>{order.user?.address || "Không có địa chỉ"}</div>
                </div>

                {/* Items */}
                <div className={styles.infoBlock}>
                    <div className={styles.label}>Sản phẩm</div>
                    <ul className={styles.itemList}>
                        {order.items?.map((item: any) => (
                            <li key={item.id} className={styles.itemRow}>
                                <span>
                                    <span className={styles.quantity}>{item.quantity}x</span> 
                                    {item.product?.name}
                                </span>
                                <span>{Number(item.price).toLocaleString()}đ</span>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.totalRow}>
                        <span>Tổng tiền</span>
                        <span>{Number(order.total_amount).toLocaleString()}đ</span>
                    </div>
                </div>
            </div>
        </div>

        {/* ACTIONS BUTTONS */}
        <div className={styles.actionGrid}>
            
            {currentStatus === 'assigned' && (
                <button onClick={() => handleUpdateStatus("picked_up")} className={`${styles.btn} ${styles.btnPrimary}`}>
                    Đã lấy hàng (Picked Up)
                </button>
            )}

            {currentStatus === 'picked_up' && (
                <button onClick={() => handleUpdateStatus("in_transit")} className={`${styles.btn} ${styles.btnBlue}`}>
                    Bắt đầu giao (In Transit)
                </button>
            )}

            {(currentStatus === 'picked_up' || currentStatus === 'in_transit') && (
                <button onClick={() => fileRef.current?.click()} className={`${styles.btn} ${styles.btnGreen}`}>
                    {uploading ? "Đang tải ảnh..." : "✅ Giao thành công (Chụp ảnh)"}
                </button>
            )}

            {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
                <button onClick={() => handleUpdateStatus("cancelled")} className={`${styles.btn} ${styles.btnDanger}`}>
                    Hủy đơn / Giao thất bại
                </button>
            )}
        </div>

        <input type="file" ref={fileRef} accept="image/*" capture="environment" className={styles.hidden} onChange={onFileChange} />
      </div>
    </main>
  );
}