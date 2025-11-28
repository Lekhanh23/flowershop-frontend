"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import styles from "./ProductForm.module.css";

interface ProductFormProps {
  initialData?: any; // Dữ liệu sản phẩm nếu là Edit
  isEditMode?: boolean;
}

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<any[]>([]); // Danh sách collection để chọn

  // State form
  const [form, setForm] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    collection_id: initialData?.collection?.id || "",
    stock: initialData?.stock || 0,
    status: initialData?.status || "in_stock",
    image: initialData?.image || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image ? getImageUrl(initialData.image) : null
  );

  // Lấy danh sách Collection để hiển thị trong dropdown
  useEffect(() => {
    api.get('/admin/collections?limit=100').then(res => {
      setCollections(res.data.data || []);
    }).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageName = form.image;

      // 1. Upload ảnh nếu có file mới
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageName = uploadRes.data.filename;
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        collection_id: Number(form.collection_id) || null,
        stock: Number(form.stock),
        status: form.status,
        image: finalImageName,
      };

      if (isEditMode && initialData?.id) {
        await api.patch(`/admin/products/${initialData.id}`, payload);
        alert("Product updated successfully!");
      } else {
        await api.post('/admin/products', payload);
        alert("Product added successfully!");
      }

      router.push('/admin/products'); // Quay lại trang danh sách
    } catch (error) {
      console.error(error);
      alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${initialData.id}`);
      router.push('/admin/products');
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{isEditMode ? `Edit Product: ${initialData.name}` : "Add New Product"}</h1>

      <div className={styles.contentWrapper}>
        {/* Form bên trái */}
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.field}>
            <label>Product name</label>
            <input name="name" value={form.name} onChange={handleChange} required className={styles.input} />
          </div>

          <div className={styles.field}>
            <label>Price (VND)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required className={styles.input} />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={styles.textarea} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Collection</label>
              <select name="collection_id" value={form.collection_id} onChange={handleChange} className={styles.select}>
                <option value="">-- Select collection --</option>
                {collections.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={styles.select}>
                <option value="in_stock">In stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Product image</label>
            <div className={styles.imageUpload}>
              {previewImage ? (
                <img src={previewImage} alt="Preview" className={styles.preview} />
              ) : (
                <div className={styles.placeholder}>No image</div>
              )}
              <div className={styles.uploadMeta}>
                <span>{imageFile ? imageFile.name : (form.image || "No image selected")}</span>
                <input type="file" onChange={handleFileChange} accept="image/*" />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Saving..." : (isEditMode ? "Update" : "Add Product")}
            </button>
            {isEditMode && (
                <button type="button" onClick={handleDelete} className={styles.deleteBtnOutline}>Delete product</button>
            )}
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>Cancel</button>
          </div>

        </form>

        {/* Panel thông tin phụ bên phải (Chỉ hiện khi Edit) */}
        {isEditMode && (
          <div className={styles.sidebar}>
            <div className={styles.metaBox}>
              <p><strong>ID:</strong> {initialData.id}</p>
              <p><strong>Created at:</strong> {new Date(initialData.created_at).toLocaleString()}</p>
              <p><strong>Last edited:</strong> {new Date().toLocaleString()}</p> {/* Giả lập */}
            </div>
            <div className={styles.historyBox}>
              <h4>Edit History</h4>
              <p style={{fontSize: 13, color: '#666'}}>2025-11-23 23:04:38</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}