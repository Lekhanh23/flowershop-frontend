"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { getImageUrl } from "@/lib/utils"; 
import api from "@/lib/api"; // Gọi API có kèm token

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- 1. LOAD GIỎ HÀNG TỪ API ---
  const fetchCart = async () => {
    try {
        // Gọi API: CartController.getMyCart
        const res = await api.get('/cart');
        setCartItems(res.data);
    } catch (error) {
        console.error("Lỗi tải giỏ hàng", error);
        // Nếu lỗi 401 Unauthorized -> đẩy về login
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- 2. CẬP NHẬT SỐ LƯỢNG ---
  const handleQuantityChange = async (itemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
        // Gọi API: CartController.updateQuantity
        await api.patch(`/cart/${itemId}`, { quantity: newQty });
        fetchCart(); // Load lại dữ liệu mới nhất
    } catch (error: any) {
        alert(error.response?.data?.message || "Lỗi cập nhật");
    }
  };

  // --- 3. XÓA SẢN PHẨM ---
  const handleRemoveItem = async (itemId: number) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    try {
        // Gọi API: CartController.removeFromCart
        await api.delete(`/cart/${itemId}`);
        fetchCart();
    } catch (error) {
        console.error(error);
    }
  };

  // Tính tổng tiền (Display only)
  const subtotal = cartItems.reduce((acc, item) => {
      const productPrice = Number(item.product.price);
      const servicePrice = item.service ? Number(item.service.price) : 0;
      return acc + (productPrice + servicePrice) * item.quantity;
  }, 0);

  if (loading) return <div className={styles.loading}>Loading cart...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>SHOPPING CART</h1>
        <p>{cartItems.length} items in your bag</p>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is currently empty.</p>
          <Link href="/customer/collection" className={styles.continueBtn}>Start Shopping</Link>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.itemList}>
            {/* ... (Header Table giữ nguyên) ... */}
            
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemProduct}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={getImageUrl(item.product.image)} 
                      alt={item.product.name} 
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/100x120?text=No+Image")}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3>{item.product.name}</h3>
                    {item.service && <span>Included: {item.service.name}</span>}
                  </div>
                </div>

                <div className={styles.itemPrice}>
                  {Number(item.product.price).toLocaleString("vi-VN")} đ
                </div>

                <div className={styles.itemQty}>
                  <div className={styles.qtyControl}>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)}>+</button>
                  </div>
                </div>

                <div className={styles.itemTotal}>
                  {/* Tính tổng item + service */}
                  {((Number(item.product.price) + (item.service ? Number(item.service.price) : 0)) * item.quantity).toLocaleString("vi-VN")} đ
                </div>

                <div className={styles.itemAction}>
                  <button onClick={() => handleRemoveItem(item.id)} className={styles.removeBtn}>×</button>
                </div>
              </div>
            ))}

            <div className={styles.backLinkWrapper}>
               <Link href="/customer/collection" className={styles.backLink}>← Continue Shopping</Link>
            </div>
          </div>

          <div className={styles.summaryBox}>
            <h2>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            
            {/* Nút này sẽ dẫn sang trang Checkout */}
            <Link href="/customer/checkout" className={styles.checkoutBtn}>PROCEED TO CHECKOUT</Link>
          </div>
        </div>
      )}
    </div>
  );
}