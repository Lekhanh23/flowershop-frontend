"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

type Product = {
    id: number;
    image: string;
    name: string;
    price: number;
    status: string;
    createdAt: string;
};

<<<<<<< HEAD
const initialProducts: Product[] = [
	{ id: 1, image: "https://via.placeholder.com/48", name: "Red Rose Bouquet", price: 450000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 2, image: "https://via.placeholder.com/48", name: "White Lily Elegance", price: 520000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 3, image: "https://via.placeholder.com/48", name: "Sunflower Sunshine", price: 390000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 4, image: "https://via.placeholder.com/48", name: "Mixed Tulip Delight", price: 470000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 5, image: "https://via.placeholder.com/48", name: "Pink Carnation Love", price: 430000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 6, image: "https://via.placeholder.com/48", name: "Orchid Grace", price: 600000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 7, image: "https://via.placeholder.com/48", name: "Peony Bloom", price: 580000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 8, image: "https://via.placeholder.com/48", name: "Gerbera Fun Pack", price: 360000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 9, image: "https://via.placeholder.com/48", name: "Lavender Peace", price: 490000, status: "instock", createdAt: "2025-06-02 22:22:42" },
	{ id: 10, image: "https://via.placeholder.com/48", name: "Daisy Freshness", price: 350000, status: "instock", createdAt: "2025-06-02 22:22:42" },
];
=======
>>>>>>> 58f8ee4124f97680529b8ee1c5395b7d8fc39789
function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US").format(price) + " VND";
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState({ name: "", price: "", image: "", status: "instock" });
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Base API path — thay đổi nếu backend đặt ở path khác
    const API_BASE = "/api/products";

    async function fetchProducts() {
        setLoadingList(true);
        setError(null);
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error(`Fetch products failed: ${res.status}`);
            const data = await res.json();
            // assuming backend returns array of products
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Không thể tải danh sách sản phẩm.");
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    function handleAddClick() {
        setEditingProduct(null);
        setForm({ name: "", price: "", image: "", status: "instock" });
        setIsModalOpen(true);
    }

    function handleEdit(id: number) {
        const p = products.find((x) => x.id === id);
        if (!p) return;
        setEditingProduct(p);
        setForm({ name: p.name, price: String(p.price), image: p.image, status: p.status });
        setIsModalOpen(true);
    }

    async function handleDelete(id: number) {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            // remove from UI
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại. Thử lại.");
        } finally {
            setLoading(false);
        }
    }

    function formatDateLocal(d = new Date()) {
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    async function handleSave() {
        if (!form.name.trim() || !form.price.trim()) {
            alert("Vui lòng nhập tên và giá sản phẩm");
            return;
        }
        const priceNum = Number(form.price.toString().replace(/[^0-9.-]+/g, ""));
        if (isNaN(priceNum)) {
            alert("Giá không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            if (editingProduct) {
                // update
                const body = {
                    name: form.name,
                    price: priceNum,
                    image: form.image,
                    status: form.status,
                };
                const res = await fetch(`${API_BASE}/${editingProduct.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error("Update failed");
                const updated: Product = await res.json();
                setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            } else {
                // create
                const body = {
                    name: form.name,
                    price: priceNum,
                    image: form.image || "https://via.placeholder.com/48",
                    status: form.status,
                    createdAt: formatDateLocal(new Date()),
                };
                const res = await fetch(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error("Create failed");
                const created: Product = await res.json();
                // add to top
                setProducts((prev) => [created, ...prev]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Lưu thất bại. Kiểm tra server.");
        } finally {
            setLoading(false);
        }
    }

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Product Management</h2>
                <button className={styles.addButton} onClick={handleAddClick} disabled={loading || loadingList}>
                    + Add Product
                </button>
            </div>

            {loadingList ? (
                <div>Loading products...</div>
            ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price (VND)</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>
                                        <img src={p.image} alt={p.name} className={styles.thumb} />
                                    </td>
                                    <td className={styles.name}>{p.name}</td>
                                    <td className={styles.price}>{formatPrice(p.price)}</td>
                                    <td>
                                        <span className={p.status === "instock" ? styles.statusIn : styles.statusOut}>{p.status}</span>
                                    </td>
                                    <td>{p.createdAt}</td>
                                    <td>
                                        <button className={styles.editBtn} onClick={() => handleEdit(p.id)} disabled={loading}>
                                            Edit
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)} disabled={loading}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
                        <div className={styles.formRow}>
                            <label>Name</label>
                            <input name="name" value={form.name} onChange={handleFormChange} />
                        </div>
                        <div className={styles.formRow}>
                            <label>Price</label>
                            <input name="price" value={form.price} onChange={handleFormChange} placeholder="e.g. 450000" />
                        </div>
                        <div className={styles.formRow}>
                            <label>Image URL</label>
                            <input name="image" value={form.image} onChange={handleFormChange} placeholder="https://..." />
                        </div>
                        <div className={styles.formRow}>
                            <label>Status</label>
                            <select name="status" value={form.status} onChange={handleFormChange}>
                                <option value="instock">instock</option>
                                <option value="outstock">outstock</option>
                            </select>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.editBtn} onClick={handleSave} disabled={loading}>
                                {editingProduct ? "Save" : "Add"}
                            </button>
                            <button className={styles.deleteBtn} onClick={handleCloseModal} disabled={loading}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
