"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Dùng để chuyển trang
import styles from './page.module.css';

// --- CẤU HÌNH ---
const BACKEND_URL = 'http://localhost:3000';

export default function ProfilePage() {
  const router = useRouter();

  // --- STATE ---
  const [user, setUser] = useState<any>(null); 
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // State form đổi mật khẩu
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State chỉnh sửa thông tin
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: ''
  });

  // --- 1. FETCH DATA THẬT TỪ API ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Lấy token từ LocalStorage (Token này có được khi bạn Login thành công)
      const token = localStorage.getItem('accessToken'); 

      // Nếu không có token => Chưa đăng nhập
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // A. Gọi API lấy thông tin User (Profile)
        // Backend cần có endpoint: GET /api/users/profile (hoặc /api/auth/profile)
        const userRes = await fetch(`${BACKEND_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Gửi kèm Token để xác thực
          }
        });

        if (userRes.status === 401) {
          // Token hết hạn hoặc không hợp lệ -> Logout
          handleLogout();
          return;
        }

        const userData = await userRes.json();
        
        if (userData) {
          setUser(userData);
          setFormData({
            full_name: userData.full_name || '',
            phone: userData.phone || '',
            address: userData.address || ''
          });

          // B. Gọi API lấy danh sách đơn hàng của User này
          // Backend cần có endpoint: GET /api/orders/my-orders
          const orderRes = await fetch(`${BACKEND_URL}/api/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (orderRes.ok) {
            const orderData = await orderRes.json();
            // Nếu backend trả về { data: [...] } thì lấy .data, nếu mảng thì lấy luôn
            setOrders(Array.isArray(orderData) ? orderData : orderData.data || []);
          }
        }

      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. HÀM LOGOUT ---
  const handleLogout = () => {
    // Xóa token và giỏ hàng
    localStorage.removeItem('accessToken');
    localStorage.removeItem('cart'); 
    localStorage.removeItem('user');
    
    // Reset state hoặc reload trang
    setUser(null);
    router.push('/login'); // Chuyển về trang đăng nhập
  };

  // --- 3. CẬP NHẬT THÔNG TIN (GỌI API) ---
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
        method: 'PUT', // Hoặc PATCH tùy backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser); // Cập nhật lại UI
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Lỗi cập nhật. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server.");
    }
  };

  // --- 4. ĐỔI MẬT KHẨU (GỌI API) ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    if (passForm.newPassword !== passForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/change-password`, {
        method: 'POST', // Hoặc PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword
        })
      });

      if (res.ok) {
        alert("Đổi mật khẩu thành công!");
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const errData = await res.json();
        alert(`Lỗi: ${errData.message || "Không thể đổi mật khẩu"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống.");
    }
  };

  // --- HELPER: MÀU TRẠNG THÁI ---
  const renderStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'pending': return <span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</span>;
      case 'shipped': return <span className={`${styles.statusBadge} ${styles.statusShipped}`}>Shipped</span>;
      case 'delivered': return <span className={`${styles.statusBadge} ${styles.statusDelivered}`}>Delivered</span>;
      case 'cancelled': return <span className={`${styles.statusBadge} ${styles.statusCancelled}`}>Cancelled</span>;
      default: return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  // --- RENDER ---
  if (loading) return <div style={{textAlign:'center', padding: 50}}>Loading profile...</div>;

  // CHƯA ĐĂNG NHẬP
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.guestContainer}>
          <h2 className={styles.guestTitle}>Welcome to Blossom Flower Shop</h2>
          <p className={styles.guestText}>Please log in to manage your orders and profile.</p>
          <div className={styles.authButtonGroup}>
            <Link href="/login" className={`${styles.authBtn} ${styles.loginBtn}`}>Log In</Link>
            <Link href="/register" className={`${styles.authBtn} ${styles.registerBtn}`}>Register</Link>
          </div>
        </div>
      </div>
    );
  }

  // ĐÃ ĐĂNG NHẬP
  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.subtitle}>Hello, {user.full_name}</p>
        
        {/* Nút Logout */}
        <button onClick={handleLogout} className={styles.logoutLink}>
          Log out
        </button>
      </div>

      <div className={styles.profileWrapper}>
        
        {/* --- CỘT TRÁI: INFO & PASSWORD --- */}
        <div className={styles.leftColumn}>
          
          <h3 className={styles.sectionTitle}>Account Details</h3>
          <form onSubmit={handleUpdateInfo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input 
                type="text" className={styles.input} required
                value={formData.full_name} disabled={!isEditing}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} value={user.email} disabled />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input 
                type="text" className={styles.input} 
                value={formData.phone} disabled={!isEditing}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Address</label>
              <input 
                type="text" className={styles.input} 
                value={formData.address} disabled={!isEditing}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            {isEditing ? (
              <div style={{display:'flex', gap: 10}}>
                <button type="submit" className={styles.saveBtn}>Save</button>
                <button 
                  type="button" className={styles.saveBtn} style={{background: '#999'}} 
                  onClick={() => { 
                    setIsEditing(false); 
                    setFormData({full_name: user.full_name, phone: user.phone, address: user.address}); 
                  }}
                >Cancel</button>
              </div>
            ) : (
              <button type="button" className={styles.saveBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </form>

          <div className={styles.divider}></div>

          <h3 className={styles.sectionTitle}>Change Password</h3>
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
              <label className={styles.label}>Confirm New Password</label>
              <input 
                type="password" className={styles.input} required 
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
              />
            </div>
            <button type="submit" className={styles.saveBtn}>Update Password</button>
          </form>
        </div>

        {/* --- CỘT PHẢI: ĐƠN HÀNG --- */}
        <div className={styles.rightColumn}>
          <h3 className={styles.sectionTitle}>Order History & Tracking</h3>
          
          {orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <div className={styles.orderList}>
              {orders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  
                  <div className={styles.orderBody}>
                    <div className={styles.orderTotal}>
                      Total: <span>{Number(order.total_amount).toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <div style={{marginBottom: 5}}>Status:</div>
                        {renderStatusBadge(order.status)}
                        {/* Nếu có delivery_status thì hiện thêm */}
                        {order.delivery_status && (
                           <div style={{fontSize: 12, color: '#666', marginTop: 5}}>
                             Delivery: {order.delivery_status}
                           </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}