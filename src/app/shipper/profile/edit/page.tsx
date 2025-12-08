"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import styles from "./page.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    api.get("/shipper/profile")
      .then(res => {
        setForm({
            fullName: res.data.user.full_name,
            phone: res.data.user.phone || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
        await api.patch("/shipper/profile/update", { phone: form.phone });
        router.back(); 
    } catch(e) {
        alert("Cập nhật thất bại.");
    } finally {
        setSubmitting(false);
    }
  };

  if(loading) return <div style={{padding: 40, textAlign: 'center'}}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Cập nhật thông tin</h1>
        
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Họ và tên</label>
                <input 
                    className={`${styles.input} ${styles.inputDisabled}`}
                    value={form.fullName}
                    disabled
                />
                <p className={styles.hint}>Không thể thay đổi tên tài khoản.</p>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Số điện thoại</label>
                <input 
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="Nhập số điện thoại..."
                    required
                />
            </div>

            <div className={styles.actions}>
                <button 
                    type="button" 
                    onClick={() => router.back()}
                    className={styles.cancelBtn}
                >
                    Hủy bỏ
                </button>
                <button 
                    type="submit" 
                    disabled={submitting}
                    className={styles.saveBtn}
                >
                    {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}