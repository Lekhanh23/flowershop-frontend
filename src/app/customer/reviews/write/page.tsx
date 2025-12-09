"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id');

  const [product, setProduct] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Load thông tin sản phẩm để hiển thị tên và ảnh
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        // Gọi API lấy chi tiết sản phẩm
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        // Nếu lỗi (ví dụ chưa có API detail public), thử fallback lấy từ list
        try {
            const listRes = await api.get('/products?limit=100');
            const found = (listRes.data.data || []).find((p: any) => p.id == productId);
            setProduct(found);
        } catch (e) {}
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // 2. Xử lý Submit Review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    
    setSubmitting(true);
    try {
      // Gọi API POST /reviews (Cần đảm bảo Backend đã có Controller xử lý)
      await api.post('/reviews', {
        productId: Number(productId),
        rating,
        comment
      });
      
      alert("Cảm ơn bạn đã đánh giá!");
      router.push('/customer/profile'); // Quay lại trang cá nhân
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi khi gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!productId) return <div className={styles.container}>Không tìm thấy sản phẩm.</div>;
  if (loading) return <div className={styles.container} style={{textAlign:'center'}}>Đang tải...</div>;
  if (!product) return <div className={styles.container}>Sản phẩm không tồn tại.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>FEEDBACK</h1>

      {/* Thông tin sản phẩm */}
      <div className={styles.productInfo}>
        <div className={styles.imgWrapper}>
            <img 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            className={styles.productImg}
            onError={(e) => e.currentTarget.src = "https://placehold.co/80x80?text=Img"}
            />
        </div>
        <div className={styles.productDetails}>
            <div className={styles.productName}>{product.name}</div>
            <div className={styles.productPrice}>{Number(product.price).toLocaleString()}đ</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Chọn sao */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Your Rating</label>
          <div className={styles.starGroup}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`${styles.starBtn} ${star <= rating ? styles.active : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <div className={styles.ratingText}>
            {rating === 5 && "Excellent!"}
            {rating === 4 && "Very Good"}
            {rating === 3 && "Good"}
            {rating === 2 && "Fair"}
            {rating === 1 && "Poor"}
          </div>
        </div>

        {/* Viết nhận xét */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Your Review</label>
          <textarea
            className={styles.textarea}
            placeholder="Tell us what you liked or disliked about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <div className={styles.actions}>
            <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => router.back()}
            >
                Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
        </div>
      </form>
    </div>
  );
}

// Bọc Suspense để tránh lỗi khi build nextjs với useSearchParams
export default function WriteReviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewForm />
    </Suspense>
  );
}