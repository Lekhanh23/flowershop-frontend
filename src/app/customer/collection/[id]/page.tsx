"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { getImageUrl, formatPrice } from "@/lib/utils";

// Kiểu dữ liệu
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CollectionInfo {
  id: number;
  name: string;
  description?: string;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params?.id; // Lấy ID từ URL (ví dụ: /customer/collection/1 -> id=1)
  
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] = useState<CollectionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Gọi API lấy thông tin Collection (để lấy tên hiển thị tiêu đề)
        // Backend: PublicCollectionsController.findOne
        const colRes = await fetch(`http://localhost:3000/api/collections/${id}`);
        if (colRes.ok) {
          const colData = await colRes.json();
          setCollection(colData);
        }

        // 2. Gọi API lấy sản phẩm của Collection này
        // Backend: PublicProductsController.findAll (đã có logic filter theo collection_id)
        const prodRes = await fetch(`http://localhost:3000/api/products?collection_id=${id}&limit=100`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          // Backend trả về { data: [...], ... } hoặc mảng trực tiếp
          setProducts(Array.isArray(prodData.data) ? prodData.data : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.headerSection}>
        {/* Breadcrumb giả lập tabs */}
        <div className={styles.navFake}>
          <Link href="/customer/collection" className={styles.navItem}>
            All Occasions
          </Link>
          {/* Tên collection đang xem sẽ được gạch chân */}
          <span className={styles.navItemActive}>
            {loading ? "Loading..." : collection?.name}
          </span>
        </div>

        <h1 className={styles.title}>
          {loading ? "..." : (
            <>
              EXPLORE OUR FLOWER COLLECTION<br />
              FOR {collection?.name?.toUpperCase()}
            </>
          )}
        </h1>
      </div>

      {/* PRODUCT GRID */}
      <div className={styles.productGrid}>
        {loading ? (
          <p className={styles.loading}>Loading products...</p>
        ) : products.length === 0 ? (
          <p className={styles.empty}>No products found in this collection.</p>
        ) : (
          products.map((product) => (
            // Card sản phẩm
            <div key={product.id} className={styles.productCard}>
              <Link href={`/customer/bouquet/${product.id}`}> {/* Link sang chi tiết hoa */}
                <div className={styles.imageWrapper}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className={styles.productImage}
                    onError={(e) => e.currentTarget.src = "https://placehold.co/400x400?text=No+Image"}
                  />
                </div>
                <div className={styles.productName}>{product.name}</div>
              </Link>
              <div className={styles.productPrice}>
                {formatPrice(product.price)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}