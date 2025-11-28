"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "./page.module.css";
import { formatPrice } from "@/lib/utils";

// Định nghĩa kiểu dữ liệu dựa trên những gì Backend trả về
interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
  // Quan trọng: Service (Card)
  service: {
    name: string;
    price: number;
  } | null;
}

interface OrderDetail {
  id: number;
  total_amount: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchOrderDetail = async () => {
      try {
        const res = await api.get(`/orders/admin/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetail();
  }, [id]);

  if (loading) return <div className="p-8">Loading details...</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Management</h1>
      
      <Link href="/admin/orders" className={styles.backLink}>
        ← Back to all orders
      </Link>

      <h2 className={styles.subTitle}>Order #{order.id} Details</h2>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Card</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => {
              // Giá hiển thị = Giá SP + Giá Dịch vụ (nếu có)
              // Nếu muốn tách riêng, bạn có thể hiển thị 2 dòng. 
              // Ở đây tôi gộp vào Price giống như ảnh mẫu (Subtotal = Price * Qty)
              const itemPrice = Number(item.price); // Giá gốc SP lúc mua
              const servicePrice = item.service ? Number(item.service.price) : 0;
              
              // Tổng giá đơn vị cho 1 set (Hoa + Thiệp)
              // *Lưu ý: Nếu logic của bạn là Service tính riêng không nhân quantity, cần sửa lại công thức
              const unitPrice = itemPrice + servicePrice;
              const subtotal = unitPrice * item.quantity;

              return (
                <tr key={item.id}>
                  <td>
                    <span className={styles.productCell}>{item.product.name}</span>
                  </td>
                  <td>
                    {item.service ? item.service.name : "-"}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(unitPrice)}</td>
                  <td>{formatPrice(subtotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}