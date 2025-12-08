"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

// CẤU HÌNH ĐƯỜNG DẪN API (Sửa 1 chỗ này là được)
const API_BASE = "http://localhost:3000"; 

export default function ProfilePage() {
  const router = useRouter();
  
  // --- STATE ---
  const [user, setUser] = useState<any>(null); // Dùng any để đỡ lỗi type
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "password" | "orders">("info");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "" });

  // State đổi pass
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  // --- 1. KIỂM TRA LOGIN & LẤY DỮ LIỆU ---
  useEffect(() => {
    // Check token trong túi
    const token = localStorage.getItem("accessToken"); 
    
    if (!token) {
      router.push("/login"); // Không có chìa khóa -> Về trang login
      return;
    }

    // Hàm gọi API lấy thông tin User
    const fetchProfile = async () => {
      try {
        // Gọi thử vào đường dẫn phổ biến nhất
        const res = await fetch(`${API_BASE}/auth/me`, { // Hoặc /api/users/profile
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          // LOGIC THÔNG MINH: Tự dò xem dữ liệu nằm ở đâu
          // Nếu backend trả về { data: user } thì lấy data.data
          // Nếu backend trả về { user } thì lấy data
          const userData = data.data || data.user || data; 
          
          setUser(userData);
          setEditForm({
            name: userData.name || "",
            phone: userData.phone || "",
            address: userData.address || "",
          });
        } else {
          // Token hết hạn hoặc lỗi
          if (res.status === 401) {
             localStorage.removeItem("accessToken");
             router.push("/login");
          }
        }
      } catch (err) {
        console.error("Lỗi mạng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // --- XỬ LÝ UPDATE ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    
    try {
      // Gọi API update (Bạn cần hỏi backend đường dẫn chính xác, thường là PUT /users/update)
      const res = await fetch(`${API_BASE}/api/users/update`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const newData = await res.json();
        setUser({ ...user, ...editForm }); // Cập nhật giao diện ngay
        setIsEditing(false);
        setMessage({ type: "success", text: "Cập nhật thành công!" });
      } else {
        setMessage({ type: "error", text: "Lỗi cập nhật. Vui lòng thử lại." });
      }
    } catch (error) {
       // Nếu API chưa có thì giả vờ thành công để test UI
       setUser({ ...user, ...editForm });
       setIsEditing(false);
       setMessage({ type: "success", text: "Đã lưu (Demo UI)." });
    }
  };

  // --- RENDER ---
  if (loading) return <div className={styles.loading}>Đang tải thông tin...</div>;
  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>TÀI KHOẢN CỦA TÔI</h1>
        <p>Xin chào, {user.name || user.email}!</p>
      </div>

      <div className={styles.layout}>
        {/* MENU BÊN TRÁI */}
        <aside className={styles.sidebar}>
          <div className={styles.avatarCircle}>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <nav className={styles.navMenu}>
            <button 
              className={activeTab === "info" ? styles.active : ""} 
              onClick={() => setActiveTab("info")}
            >
              Thông tin tài khoản
            </button>
            <button 
              className={activeTab === "orders" ? styles.active : ""} 
              onClick={() => setActiveTab("orders")}
            >
              Lịch sử đơn hàng
            </button>
            <button 
              className={activeTab === "password" ? styles.active : ""} 
              onClick={() => setActiveTab("password")}
            >
              Đổi mật khẩu
            </button>
            <button 
              className={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("accessToken");
                router.push("/login");
              }}
            >
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* NỘI DUNG BÊN PHẢI */}
        <main className={styles.content}>
          {message && (
            <div className={message.type === "error" ? styles.alertError : styles.alertSuccess}>
              {message.text}
            </div>
          )}

          {/* TAB 1: THÔNG TIN */}
          {activeTab === "info" && (
            <div className={styles.tabBox}>
              <div className={styles.boxHeader}>
                <h2>Thông tin cá nhân</h2>
                {!isEditing && (
                  <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Họ và tên</label>
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Số điện thoại</label>
                    <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Địa chỉ</label>
                    <input value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                  </div>
                  <div className={styles.btnRow}>
                    <button type="submit" className={styles.saveBtn}>Lưu thay đổi</button>
                    <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Hủy</button>
                  </div>
                </form>
              ) : (
                <div className={styles.infoView}>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
                  <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
                  <p><strong>Vai trò:</strong> {user.role || "Customer"}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ĐƠN HÀNG (Giả lập giao diện nếu chưa có API) */}
          {activeTab === "orders" && (
             <div className={styles.tabBox}>
               <h2>Đơn hàng của tôi</h2>
               <p>Tính năng đang cập nhật...</p>
               {/* Sau này map orders vào đây */}
             </div>
          )}

          {/* TAB 3: ĐỔI PASS */}
          {activeTab === "password" && (
             <div className={styles.tabBox}>
               <h2>Đổi mật khẩu</h2>
               <form className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Mật khẩu hiện tại</label>
                    <input type="password" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Mật khẩu mới</label>
                    <input type="password" />
                  </div>
                  <button className={styles.saveBtn}>Cập nhật</button>
               </form>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}