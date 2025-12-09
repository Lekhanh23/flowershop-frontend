"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css"; 

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]); 
  const [shippers, setShippers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resOrders, resShippers] = await Promise.all([
            api.get("/orders/admin/all"),
            // Lấy cả profile để check status available/busy
            api.get("/users/admin/list?role=shipper&limit=100") 
        ]);
        
        setOrders(Array.isArray(resOrders.data.data) ? resOrders.data.data : []);
        setShippers(Array.isArray(resShippers.data.data) ? resShippers.data.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Assign
  const handleAssignShipper = async (orderId: number, shipperIdStr: string) => {
      if (!shipperIdStr) return;
      const shipperId = Number(shipperIdStr);
      const selectedShipper = shippers.find(s => s.id === shipperId);
      
      // Check nếu shipper đang bận (Optional)
      const isBusy = selectedShipper?.shipperProfile?.status !== 'available';
      const confirmMsg = isBusy 
        ? `Shipper ${selectedShipper?.full_name} đang BẬN. Bạn có chắc vẫn muốn gán đơn này?`
        : `Phân công đơn #${orderId} cho shipper ${selectedShipper?.full_name}?`;

      if(!confirm(confirmMsg)) return;

      try {
          //
          await api.patch(`/orders/admin/${orderId}/assign`, { shipperId });
          
          alert("Phân công thành công!");
          
          // Optimistic Update
          setOrders(prev => prev.map(order => {
              if (order.id === orderId) {
                  return { 
                      ...order, 
                      shipper: selectedShipper, 
                      shipperId: shipperId,
                      status: 'shipped', 
                      deliveryStatus: 'assigned'
                  };
              }
              return order;
          }));

      } catch (error: any) {
          console.error(error);
          alert(error.response?.data?.message || "Lỗi phân công shipper");
      }
  };

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
              <th style={{width: '50px'}}>No.</th>       
              <th style={{width: '80px'}}>ID</th>  
              <th>Customer</th>  
              <th>Total</th>     
              <th style={{width: '220px'}}>Shipper Assignment</th>   
              <th>Status</th>    
              <th>Date</th>      
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
                <tr><td colSpan={7} className={styles.empty}>No orders found.</td></tr>
            ) : (
                orders.map((o: any, index: number) => {
                    const hasShipper = !!o.shipper;
                    const isCompleted = o.status === 'delivered' || o.status === 'cancelled';
                    
                    return (
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
                            
                            {/* CỘT SHIPPER VỚI MÀU SẮC */}
                            <td>
                                <div className={styles.selectWrapper}>
                                    <select 
                                        className={`${styles.selectShipper} ${hasShipper ? styles.assigned : styles.unassigned}`}
                                        value={o.shipper?.id || ""}
                                        onChange={(e) => handleAssignShipper(o.id, e.target.value)}
                                        disabled={isCompleted}
                                    >
                                        <option value="" disabled>
                                            {hasShipper ? "Change Shipper" : "⚠️ Unassigned"}
                                        </option>
                                        
                                        {shippers.map(s => {
                                            const isAvailable = s.shipperProfile?.status === 'available';
                                            return (
                                                <option key={s.id} value={s.id}>
                                                    {isAvailable ? "🟢" : "🔴"} {s.full_name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </td>

                            <td>
                                <span className={`${styles.badge} ${getStatusClass(o.status)}`}>
                                    {o.status}
                                </span>
                            </td>
                            <td className={styles.date}>
                                {new Date(o.order_date || o.created_at).toLocaleDateString('en-GB')}
                            </td>
                        </tr>
                    );
                })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}