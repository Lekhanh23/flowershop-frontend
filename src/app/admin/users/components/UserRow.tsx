"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from '../page.module.css'; 
import { useAuth } from '@/context/AuthContext';

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: 'admin' | 'customer' | 'shipper';
}

interface UserRowProps {
  user: User;
  disableEdit?: boolean; // Prop để tắt tính năng sửa (dùng cho trang Shipper)
  index: number;
}

export default function UserRow({ user, disableEdit = false, index }: UserRowProps) {
    const { user: currentUser } = useAuth(); // Lấy user đang đăng nhập để check quyền
    const router = useRouter();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(user);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.patch(`/admin/users/${user.id}`, formData);
            setIsEditing(false);
            alert("Cập nhật thành công!");
            // Refresh lại trang để đồng bộ dữ liệu nếu cần, 
            // hoặc bạn có thể không cần reload vì formData đã update local
            router.refresh(); 
        } catch (error) {
            console.error(error);
            alert("Lỗi khi cập nhật user");
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        if (!confirm(`Bạn có chắc chắn muốn xóa ${user.full_name}?`)) return;
        try {
            await api.delete(`/admin/users/${user.id}`);
            alert("Xóa thành công!");
            window.location.reload(); // Reload để mất dòng đã xóa
        } catch (error) {
            alert("Lỗi xóa user");
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    // --- LOGIC PHÂN QUYỀN ---
    const isRowAdmin = user.role === 'admin';
    const isMe = currentUser?.id === user.id;

    // 1. Được sửa khi: Không bị disableEdit VÀ (Không phải Admin HOẶC Là chính mình)
    const canEdit = !disableEdit && (!isRowAdmin || isMe);

    // 2. Được xóa khi: Không phải là Admin (Admin không bao giờ được xóa, kể cả chính mình)
    const canDelete = !isRowAdmin; 

    // 3. Hiển thị "Restricted" khi: Là Admin khác
    const showRestricted = isRowAdmin && !isMe; 

    return (
        <tr className={isRowAdmin ? styles.adminRow : undefined}>
            <td style={{fontWeight: 'bold'}}>{index + 1}</td>
            
            {/* Full Name */}
            <td>{isEditing ? <input name="full_name" value={formData.full_name} onChange={handleChange} className={styles.inputBox}/> : user.full_name}</td>
            
            {/* Email */}
            <td>{isEditing ? <input name="email" value={formData.email} onChange={handleChange} className={styles.inputBox}/> : user.email}</td>
            
            {/* Phone */}
            <td>{isEditing ? <input name="phone" value={formData.phone || ''} onChange={handleChange} className={styles.inputBox}/> : user.phone}</td>
            
            {/* Address */}
            <td>{isEditing ? <input name="address" value={formData.address || ''} onChange={handleChange} className={styles.inputBox}/> : user.address}</td>
            
            {/* Role */}
            <td>
                {isEditing && !isMe ? ( // Không cho tự sửa role của chính mình
                    <select name="role" value={formData.role} onChange={handleChange} className={styles.inputBox} style={{padding: '6px'}}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="shipper">Shipper</option>
                    </select>
                ) : (
                    <span style={{fontWeight: isRowAdmin ? 'bold' : 'normal', color: isRowAdmin ? '#d81b60' : 'inherit'}}>
                        {user.role}
                    </span>
                )}
            </td>
            
            {/* ACTIONS */}
            <td>
                {showRestricted ? (
                    <span className={styles.noAction}>Restricted</span>
                ) : isEditing ? (
                    <div className={styles.actions}>
                        <button onClick={handleSave} disabled={loading} className={styles.saveBtn}>{loading ? '...' : 'Save'}</button>
                        <button onClick={handleCancel} disabled={loading} className={styles.cancelBtn}>Cancel</button>
                    </div>
                ) : (
                    <div className={styles.actions}>
                        {canEdit && (
                            <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Edit</button>
                        )}
                        {canDelete && (
                            <button onClick={handleDelete} className={styles.deleteBtn}>Delete</button>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
}