"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "./page.module.css";
import { formatPrice } from "@/lib/utils";

// Hàm format ngày
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).replace(',', '');
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]); // Thêm type any[] để tránh lỗi TS
  const [shippers, setShippers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const resOrders = await api.get('/orders/admin/all?limit=100');
      setOrders(resOrders.data.data);

      const resShippers = await api.get('/admin/users?role=shipper&limit=100');
      setShippers(resShippers.data.data || []);
      
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignShipper = async (orderId: number, shipperId: string) => {
    if (!shipperId) return;
    if (!confirm("Bạn muốn giao đơn này cho shipper đã chọn?")) return;

    try {
      await api.patch(`/orders/admin/${orderId}/assign`, { shipperId: Number(shipperId) });
      alert("Đã giao việc thành công!");
      fetchData(); 
    } catch (error) {
      alert("Lỗi khi gán đơn hàng");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/orders/admin/${id}/status`, { status: newStatus });
      setOrders((prev: any) => prev.map((o: any) => 
        o.id === id ? { ...o, status: newStatus } : o
      ));
    } catch (error) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  // --- Tìm các shipper đang bận (có đơn hàng trạng thái 'shipped') ---
  const busyShipperIds = orders
    .filter((o: any) => o.status === 'shipped' && o.shipper)
    .map((o: any) => o.shipper.id);

  if (loading) return <div className="p-8">Loading Orders...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Management</h1>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>CUSTOMER</th>
              <th>TOTAL</th>
              <th>SHIPPER</th> 
              <th>STATUS</th>
              <th>CREATED AT</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any, index: number) => (
              <tr key={o.id}>
                <td style={{fontWeight: 'bold', textAlign: 'center', color: '#666'}}>{index + 1}</td>
                <td style={{fontWeight: 'bold', textAlign: 'center'}}>#{o.id}</td>
                <td>
                    <div>{o.user?.full_name || "Guest"}</div>
                    <div style={{fontSize: 12, color:'#888'}}>{o.user?.address}</div>
                </td>
                <td style={{fontWeight: 600}}>{formatPrice(o.total_amount)}</td>
                
                {/* CỘT SHIPPER */}
                <td>
                  {o.shipper ? (
                    <span style={{color: '#2196f3', fontWeight: 500}}>
                      {o.shipper.full_name}
                    </span>
                  ) : (
                    <select 
                      className={styles.statusSelect}
                      onChange={(e) => handleAssignShipper(o.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Assign --</option>
                      {shippers.map((s) => {
                        // Kiểm tra xem shipper này có đang bận không
                        const isBusy = busyShipperIds.includes(s.id);
                        return (
                          <option 
                            key={s.id} 
                            value={s.id} 
                            disabled={isBusy} // Disable nếu đang bận
                            style={isBusy ? {color: '#999', fontStyle: 'italic'} : {}}
                          >
                            {s.full_name} {isBusy ? '(Busy)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </td>

                {/* CỘT STATUS */}
                <td>
                  <select
                    className={styles.statusSelect}
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{
                        color: o.status === 'delivered' ? '#4caf50' : (o.status === 'shipped' ? '#2196f3' : '#333')
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div style={{fontSize: 11, color: '#666', marginTop: 4}}>
                  {(!o.deliveryStatus || o.deliveryStatus === 'unassigned') ? '' : `(${o.deliveryStatus})`}
                  </div>
                </td>

                <td>{formatDate(o.order_date)}</td>
                <td>
                  <Link href={`/admin/orders/${o.id}`} className={styles.viewBtn}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}