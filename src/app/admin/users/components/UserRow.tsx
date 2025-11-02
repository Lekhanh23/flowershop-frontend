'use client';

import { useState, useTransition } from 'react';
import { User } from '../lib/definitions';
import { updateUserDetails, deleteUser } from '../actions';
import { useRouter } from 'next/navigation';

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
        <tr className={`border-b ${isAdmin ? 'bg-pink-100 text-pink-700' : 'bg-white'}`}>
            <td className="px-4 py-2 font-bold">{user.id}</td>
            
            {/* Full Name */}
            <td className="px-4 py-2">
                {isEditing ? <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="border p-1 w-full"/> : user.full_name}
            </td>
            
            {/* Email */}
            <td className="px-4 py-2">
                {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-1 w-full"/> : user.email}
            </td>
            
            {/* Phone */}
            <td className="px-4 py-2">
                {isEditing ? <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="border p-1 w-full"/> : user.phone}
            </td>
            
            {/* Address */}
            <td className="px-4 py-2">
                {isEditing ? <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="border p-1 w-full"/> : user.address}
            </td>
            
            {/* Role */}
            <td className="px-4 py-2">
                {isEditing ? (
                    <select name="role" value={formData.role} onChange={handleChange} className="border p-1">
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                    </select>
                ) : user.role}
            </td>
            
            {/* Actions */}
            <td className="px-4 py-2 space-x-2 w-40">
                {isAdmin ? (
                    <span className="text-pink-600">No action</span>
                ) : isEditing ? (
                    <>
                        <button 
                            onClick={handleSave} 
                            disabled={isPending}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                            onClick={handleCancel} 
                            disabled={isPending}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={isPending || !isDeletable}
                            className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
}