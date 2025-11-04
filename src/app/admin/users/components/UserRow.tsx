'use client';

import { useState, useTransition } from 'react';
import { User } from '../lib/definitions';
import { updateUserDetails, deleteUser } from '../actions';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function UserRow({ user }: { user: User }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(user);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Hàm thay đổi giá trị input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Hàm xử lý lưu
    const handleSave = () => {
        startTransition(async () => {
            const result = await updateUserDetails(formData);
            if (result.success) {
                setIsEditing(false); // Thoát khỏi chế độ Edit
                // router.refresh(); // Tùy chọn: Next.js sẽ tự revalidatePath trong actions.ts
            } else {
                alert(`Error saving: ${result.message}`);
            }
        });
    };
    
    // Hàm xử lý xóa
    const handleDelete = () => {
        if (!confirm(`Are you sure you want to delete user ID ${user.id} (${user.full_name})?`)) return;
        
        startTransition(async () => {
            const result = await deleteUser(user.id);
            if (!result.success) {
                alert(`Error deleting: ${result.message}`);
            }
            // revalidatePath đã được gọi trong actions.ts
        });
    };

    // Hàm xử lý hủy
    const handleCancel = () => {
        setFormData(user); // Đặt lại dữ liệu về ban đầu
        setIsEditing(false);
    };

    // Xác định liệu người dùng hiện tại có phải là Admin hay không (theo ảnh mẫu)
    const isAdmin = user.role === 'admin';
    const isDeletable = user.id !== 3; // Giả sử Admin ID 3 không thể xóa

    return (
        <tr className={isAdmin ? styles.adminRow : undefined}>
            <td>{user.id}</td>
            
            {/* Full Name */}
            <td>
                {isEditing ? 
                    <input 
                        type="text" 
                        name="full_name" 
                        value={formData.full_name} 
                        onChange={handleChange} 
                        className={styles.input}
                    /> : user.full_name}
            </td>
            
            {/* Email */}
            <td>
                {isEditing ? 
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className={styles.input}
                    /> : user.email}
            </td>
            
            {/* Phone */}
            <td>
                {isEditing ? 
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone || ''} 
                        onChange={handleChange} 
                        className={styles.input}
                    /> : user.phone}
            </td>
            
            {/* Address */}
            <td>
                {isEditing ? 
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address || ''} 
                        onChange={handleChange} 
                        className={styles.input}
                    /> : user.address}
            </td>
            
            {/* Role */}
            <td>
                {isEditing ? (
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange} 
                        className={styles.select}
                    >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                    </select>
                ) : user.role}
            </td>
            
            {/* Actions */}
            <td>
                {isAdmin ? (
                    <span style={{ color: '#f06292' }}>No action</span>
                ) : isEditing ? (
                    <>
                        <button 
                            onClick={handleSave} 
                            disabled={isPending}
                            className={styles.saveBtn}
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                            onClick={handleCancel} 
                            disabled={isPending}
                            className={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className={styles.editBtn}
                        >
                            Edit
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={isPending || !isDeletable}
                            className={styles.deleteBtn}
                        >
                            Delete
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
}