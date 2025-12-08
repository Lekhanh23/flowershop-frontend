"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "./page.module.css"; // Import CSS Module

type Profile = {
  id: number;
  vehicleType: string;
  vehiclePlate: string;
  nationalId: string;
  bankAccount: string;
  status: 'available' | 'unavailable' | 'suspended';
  user: {
    full_name: string;
    email: string;
    phone: string;
  };
};

export default function ShipperProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/shipper/profile");
        setProfile(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleToggleStatus = async () => {
    if (!profile) return;
    setToggling(true);
    const newStatus = profile.status === 'available' ? 'unavailable' : 'available';
    try {
      await api.patch("/shipper/profile/status", { status: newStatus });
      setProfile({ ...profile, status: newStatus });
    } catch (e) {
      alert("Lỗi kết nối");
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  const isOnline = profile?.status === 'available';

  return (
    <main className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Shipper Profile</h1>
          <p className={styles.subtitle}>Personal information management</p>
        </div>
        
        <div className={styles.statusGroup}>
          <span className={`${styles.badge} ${isOnline ? styles.badgeOnline : styles.badgeOffline}`}>
            {isOnline ? "● ONLINE" : "○ OFFLINE"}
          </span>
          <button 
            onClick={handleToggleStatus}
            disabled={toggling}
            className={styles.toggleBtn}
          >
            {toggling ? "..." : (isOnline ? "Tắt trạng thái" : "Bật trạng thái")}
          </button>
        </div>
      </div>

      {/* SECTION 1: PERSONAL INFO */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Thông tin cá nhân</h3>
          <Link href="/shipper/profile/edit" className={styles.editLink}>Chỉnh sửa</Link>
        </div>
        
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.labelCol}>Họ và tên</td>
              <td className={styles.valueCol}>{profile?.user.full_name}</td>
            </tr>
            <tr>
              <td className={styles.labelCol}>Email</td>
              <td className={styles.valueCol}>{profile?.user.email}</td>
            </tr>
            <tr>
              <td className={styles.labelCol}>Số điện thoại</td>
              <td className={styles.valueCol}>{profile?.user.phone || "---"}</td>
            </tr>
            <tr>
              <td className={styles.labelCol}>CCCD / CMND</td>
              <td className={styles.valueCol}>{profile?.nationalId}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 2: VEHICLE & BANK */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Phương tiện & Tài khoản</h3>
        </div>
        
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.labelCol}>Loại xe</td>
              <td className={styles.valueCol}>{profile?.vehicleType}</td>
            </tr>
            <tr>
              <td className={styles.labelCol}>Biển số xe</td>
              <td className={`${styles.valueCol} ${styles.highlight}`}>{profile?.vehiclePlate}</td>
            </tr>
            <tr>
              <td className={styles.labelCol}>Tài khoản ngân hàng</td>
              <td className={`${styles.valueCol} ${styles.highlight}`}>{profile?.bankAccount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <Link href="/shipper/profile/change-password" className={styles.passwordBtn}>
          Đổi mật khẩu
        </Link>
      </div>
    </main>
  );
}