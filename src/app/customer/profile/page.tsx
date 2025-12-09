"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; 
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null); 
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '', address: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await api.get('/users/profile');
        if (userRes.data) {
          setUser(userRes.data);
          setFormData({
            full_name: userRes.data.full_name || '',
            phone: userRes.data.phone || '',
            address: userRes.data.address || ''
          });

          try {
            const orderRes = await api.get('/orders/my-orders');
            const orderList = Array.isArray(orderRes.data) ? orderRes.data : (orderRes.data.data || []);
            setOrders(orderList);
          } catch (err) {
            console.error("Order fetch error:", err);
            setOrders([]);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('cart');
            }
            router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.patch('/users/profile', formData);
      if (res.data) {
        setUser(res.data);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Cập nhật thất bại.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await api.post('/users/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      alert("Đổi mật khẩu thành công!");
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || "Đổi mật khẩu thất bại.");
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    let className = styles.badge;
    if (s === 'pending') className += ` ${styles.statusPending}`;
    else if (s === 'shipped') className += ` ${styles.statusShipped}`;
    else if (s === 'delivered') className += ` ${styles.statusDelivered}`;
    else if (s === 'cancelled') className += ` ${styles.statusCancelled}`;
    
    return <span className={className}>{status}</span>;
  };

  if (loading) return <div style={{textAlign:'center', padding: 100, color:'#666'}}>Loading...</div>;
  if (!user) return null; 

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>My Profile</h1>
      </div>

      <div className={styles.profileWrapper}>
        
        {/* --- LEFT COLUMN: USER INFO --- */}
        <aside className={styles.leftColumn}>
          <div className={styles.card}>
            <div className={styles.avatarSection}>
                <div className={styles.avatarCircle}>
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className={styles.userNameDisplay}>{user.full_name}</div>
                <div className={styles.userEmailDisplay}>{user.email}</div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.sectionHeader}>Personal Info</div>
            <form onSubmit={handleUpdateInfo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input 
                  className={styles.input} 
                  value={formData.full_name} disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input 
                  className={styles.input} 
                  value={formData.phone} disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Address</label>
                <input 
                  className={styles.input} 
                  value={formData.address} disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              
              <div className={styles.btnGroup}>
                {isEditing ? (
                  <>
                    <button type="submit" className={styles.primaryBtn}>Save</button>
                    <button 
                      type="button" className={styles.secondaryBtn}
                      onClick={() => { 
                        setIsEditing(false); 
                        setFormData({full_name: user.full_name, phone: user.phone, address: user.address}); 
                      }}
                    >Cancel</button>
                  </>
                ) : (
                  <button 
                    type="button"
                    className={styles.secondaryBtn} 
                    onClick={(e) => {
                      e.preventDefault(); 
                      setIsEditing(true);
                    }}
                  >
                    Edit Info
                  </button>
                )}
              </div>
            </form>

            <div className={styles.divider}></div>

            <div className={styles.sectionHeader}>Security</div>
            <form onSubmit={handleChangePassword}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Current Password</label>
                <input 
                  type="password" className={styles.input} required 
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm({...passForm, currentPassword: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>New Password</label>
                <input 
                  type="password" className={styles.input} required 
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm</label>
                <input 
                  type="password" className={styles.input} required 
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                />
              </div>
              <button type="submit" className={`${styles.secondaryBtn}`} style={{width: '100%'}}>Update Password</button>
            </form>
          </div>
        </aside>

        {/* --- RIGHT COLUMN: ORDER HISTORY --- */}
        <main className={styles.rightColumn}>
          <div className={styles.sectionHeader} style={{fontSize: 20, marginBottom: 20}}>Order History</div>
          
          {orders.length === 0 ? (
            <div className={styles.emptyOrders}>
              <p>You haven't placed any orders yet.</p>
              <Link href="/customer/collection" style={{color: '#d81b60', fontWeight: 600}}>Start Shopping</Link>
            </div>
          ) : (
            orders.map(order => (
              <Link 
                href={`/customer/orders/${order.id}`} 
                key={order.id} 
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.created_at || order.order_date).toLocaleDateString('vi-VN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className={styles.orderBody}>
                    <div>
                        <div className={styles.totalLabel}>Total Amount</div>
                        <div className={styles.totalPrice}>
                            {Number(order.total_amount).toLocaleString('vi-VN')}đ
                        </div>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap: '5px'}}>
                        <div className={styles.totalLabel} style={{textAlign:'right'}}>Status</div>
                        {renderStatusBadge(order.status)}
                        
                        {order.status === 'delivered' && (
                            <span style={{fontSize: 11, color: '#d81b60', fontWeight: 600}}>
                               Click to Review
                            </span>
                        )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </main>

      </div>
    </div>
  );
}