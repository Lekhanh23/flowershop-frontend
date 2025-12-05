"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import api from "@/lib/api";
import { getImageUrl, formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu Product khớp với Backend
type Product = {
    id: number;
    image: string;
    name: string;
    price: number;
    stock: number;
    status: string;
    created_at: string;
};

// Hàm format ngày giờ giống trong ảnh (yyyy-mm-dd HH:mm:ss)
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { // Định dạng 24h
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', '');
};

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    // State cho Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState({ name: "", price: "", stock: "", status: "in_stock", image: "" });
    const [imageFile, setImageFile] = useState<File | null>(null); // File ảnh upload
    const [previewImage, setPreviewImage] = useState<string | null>(null); // Xem trước ảnh

    // 1. Fetch Data
    const fetchProducts = async () => {
        try {
            const res = await api.get('/admin/products?limit=100');
            setProducts(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // 2. Handle File Change (Chọn ảnh từ máy tính)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file)); // Tạo url tạm để xem trước
        }
    };

    // 3. Handle Save (Create / Update)
    const handleSave = async () => {
        if (!form.name || !form.price) return alert("Vui lòng nhập tên và giá sản phẩm");
        setLoading(true);

        try {
            let finalImageName = form.image; // Giữ nguyên ảnh cũ nếu không chọn mới

            // Nếu có chọn file mới -> Upload lên Server trước
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageName = uploadRes.data.filename; // Lấy tên file từ server trả về
            }

            const payload = {
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                status: form.status,
                image: finalImageName,
                // collection_id: 1 // Bạn có thể thêm select collection nếu cần
            };

            if (editingProduct) {
                // Update
                const res = await api.patch(`/admin/products/${editingProduct.id}`, payload);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data : p));
            } else {
                // Create
                const res = await api.post('/admin/products', payload);
                setProducts(prev => [res.data, ...prev]); // Thêm mới vào đầu danh sách
            }

            handleCloseModal();
        } catch (error) {
            console.error(error);
            alert("Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Handle Delete
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Xóa thất bại.");
        }
    };

    // Helpers
    const handleAddClick = () => {
        router.push('/admin/products/add');
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            price: String(product.price),
            stock: String(product.stock),
            status: product.status,
            image: product.image
        });
        setPreviewImage(getImageUrl(product.image)); // Hiện ảnh cũ
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPreviewImage(null);
        setImageFile(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Product Management</h2>
                <button className={styles.addButton} onClick={handleAddClick}>+ Add Product</button>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{width: '5%'}}>ID</th>
                            <th style={{width: '10%'}}>Image</th>
                            <th style={{width: '25%'}}>Name</th>
                            <th style={{width: '15%'}}>Price (VND)</th>
                            <th style={{width: '10%'}}>Status</th>
                            <th style={{width: '20%'}}>Created At</th>
                            <th style={{width: '15%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p, index) => (
                            <tr key={p.id}>
                                <td style={{fontWeight: 'bold'}}>{index + 1}</td>
                                <td>
                                <img 
                                    src={getImageUrl(p.image)} // Dùng hàm này để lấy link đầy đủ từ backend
                                    alt={p.name} 
                                    className={styles.thumb} // Class css để chỉnh kích thước ảnh thumbnail
                                    // Thêm ảnh dự phòng nếu ảnh lỗi hoặc chưa có
                                    onError={(e) => e.currentTarget.src = "https://via.placeholder.com/50?text=No+Image"}
                                />
                                </td>
                                <td className={styles.name}>{p.name}</td>
                                <td style={{fontWeight: 500}}>{formatPrice(p.price)}</td>
                                <td>
                                    {p.status === 'in_stock' ? (
                                        <span className={styles.statusIn}>In Stock</span>
                                    ) : (
                                        <span className={styles.statusOut}>Out Stock</span>
                                    )}
                                </td>
                                <td style={{fontSize: '13px', color: '#555'}}>{formatDate(p.created_at)}</td>
                                <td>
                                    <button className={styles.editBtn} onClick={() => router.push(`/admin/products/edit/${p.id}`)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL ADD/EDIT */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                        
                        <div className={styles.formRow}>
                            <label>Product Name</label>
                            <input 
                                value={form.name} 
                                onChange={e => setForm({...form, name: e.target.value})} 
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.formRow}>
                                <label>Price</label>
                                <input 
                                    type="number" 
                                    value={form.price} 
                                    onChange={e => setForm({...form, price: e.target.value})} 
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>Stock</label>
                                <input 
                                    type="number" 
                                    value={form.stock} 
                                    onChange={e => setForm({...form, stock: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>Product Image</label>
                            <div className={styles.fileInputWrapper}>
                                <input type="file" onChange={handleFileChange} accept="image/*" />
                                {previewImage && (
                                    <img src={previewImage} alt="Preview" className={styles.previewImg} />
                                )}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>Status</label>
                            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save Product"}
                            </button>
                            <button className={styles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}