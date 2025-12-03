"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu
interface Collection {
  id: number;
  name: string;
  description: string;
}

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<Collection | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  // 1. Fetch Data
  const fetchCollections = async () => {
    try {
      // Gọi API Backend: GET /admin/collections
      const res = await api.get('/admin/collections?limit=100');
      setCollections(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch collections", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // 2. Actions
  const handleAddClick = () => {
    setEditingCol(null);
    setForm({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (col: Collection) => {
    setEditingCol(col);
    setForm({ name: col.name, description: col.description || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) return;
    try {
      await api.delete(`/admin/collections/${id}`);
      setCollections(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert("Xóa thất bại (Có thể do còn sản phẩm thuộc bộ sưu tập này)");
    }
  };

  const handleSave = async () => {
    if (!form.name) return alert("Vui lòng nhập tên bộ sưu tập");
    setSaving(true);

    try {
      if (editingCol) {
        // Update
        const res = await api.patch(`/admin/collections/${editingCol.id}`, form);
        setCollections(prev => prev.map(c => c.id === editingCol.id ? res.data : c));
      } else {
        // Create
        const res = await api.post('/admin/collections', form);
        setCollections(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading Collections...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Collection Management</h2>
        <button className={styles.addButton} onClick={handleAddClick}>+ Add Collection</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{width: '10%'}}>ID</th>
              <th style={{width: '30%'}}>Name</th>
              <th style={{width: '40%'}}>Description</th>
              <th style={{width: '20%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col.id}>
                <td style={{fontWeight: 'bold'}}>{col.id}</td>
                <td style={{fontWeight: 500}}>{col.name}</td>
                <td style={{color: '#666'}}>{col.description}</td>
                <td>
                  <div className={styles.actions}>
                  <button className={styles.editBtn} style={{backgroundColor: '#0ea5e9'}} onClick={() => router.push(`/admin/collections/${col.id}`)}>View</button>
                  <button className={styles.editBtn} onClick={() => handleEditClick(col)}>Edit</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(col.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL ADD/EDIT */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{editingCol ? "Edit Collection" : "Add New Collection"}</h3>
            
            <div className={styles.formRow}>
              <label>Collection Name</label>
              <input 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                placeholder="e.g. Birthday, Wedding..." 
                autoFocus
              />
            </div>

            <div className={styles.formRow}>
              <label>Description</label>
              <textarea 
                rows={4}
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                placeholder="Optional description..."
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}