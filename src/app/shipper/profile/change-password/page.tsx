"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import styles from "./page.module.css";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return alert("Mật khẩu xác nhận không khớp!");
    
    setSubmitting(true);
    try {
      await api.patch("/shipper/profile/password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Đổi mật khẩu</h1>
        
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Mật khẩu hiện tại</label>
                <input 
                    type="password" required 
                    className={styles.input}
                    value={form.oldPassword}
                    onChange={e => setForm({...form, oldPassword: e.target.value})}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Mật khẩu mới</label>
                <input 
                    type="password" required minLength={6}
                    className={styles.input}
                    placeholder="Tối thiểu 6 ký tự"
                    value={form.newPassword}
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Xác nhận mật khẩu mới</label>
                <input 
                    type="password" required minLength={6}
                    className={styles.input}
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword: e.target.value})}
                />
            </div>

            <button type="submit" disabled={submitting} className={styles.saveBtn}>
                {submitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>

            <div className={styles.backBtn} onClick={() => router.back()}>
                Quay lại
            </div>
        </form>
      </div>
    </div>
  );
}