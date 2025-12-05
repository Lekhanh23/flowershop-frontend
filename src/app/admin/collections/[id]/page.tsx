"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "../page.module.css"; 
import { getImageUrl, formatPrice } from "@/lib/utils";

export default function AdminCollectionDetail() {
  const { id } = useParams();
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        // Gọi API Backend: GET /admin/collections/:id
        // API này đã được viết để trả về cả relation 'products'
        const res = await api.get(`/admin/collections/${id}`);
        setCollection(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{padding: 20}}>Loading...</div>;
  if (!collection) return <div style={{padding: 20}}>Collection not found</div>;

  return (
    <div className={styles.container}>
      <Link href="/admin/collections" style={{color: '#e91e63', textDecoration: 'none', marginBottom: 20, display: 'inline-block'}}>
        ← Back to Collections
      </Link>

      <h1 className={styles.title}>{collection.name}</h1>
      <p style={{color: '#666', marginBottom: 30}}>{collection.description}</p>

      <h3 style={{fontSize: 18, fontWeight: 700, marginBottom: 15}}>Products in this Collection ({collection.products?.length || 0})</h3>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {collection.products && collection.products.length > 0 ? (
              collection.products.map((p: any, index: number) => (
                <tr key={p.id}>
                  <td style={{fontWeight: 'bold'}}>{index + 1}</td>
                  <td>
                    <img 
                        src={getImageUrl(p.image)} 
                        alt={p.name} 
                        style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee'}} 
                    />
                  </td>
                  <td className={styles.name}>{p.name}</td>
                  <td style={{fontWeight: 500}}>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span style={{
                        color: p.status === 'in_stock' ? '#4caf50' : '#f44336',
                        fontWeight: 600,
                        fontSize: 13
                    }}>
                        {p.status === 'in_stock' ? 'In Stock' : 'Out Stock'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: 20, color: '#999'}}>
                  No products in this collection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}