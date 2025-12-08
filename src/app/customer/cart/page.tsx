"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string; 
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. LOAD GIỎ HÀNG ---
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // --- 2. CẬP NHẬT LOCAL STORAGE ---
  const updateLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("storage")); 
  };

  // --- 3. CÁC HÀM XỬ LÝ (ĐÃ SỬA DÙNG INDEX) ---

  // SỬA: Dùng 'index' thay vì 'id' để tránh lỗi trùng lặp
  const handleQuantityChange = (index: number, change: number) => {
    const newItems = [...cartItems]; // Tạo bản sao mảng
    const item = newItems[index];    // Lấy đúng sản phẩm tại vị trí đó

    const newQuantity = item.quantity + change;
    // Cập nhật số lượng (tối thiểu là 1)
    newItems[index] = { ...item, quantity: newQuantity < 1 ? 1 : newQuantity };
    
    setCartItems(newItems);
    updateLocalStorage(newItems);
  };

  // SỬA: Dùng 'index' để xóa đúng dòng đó
  const handleRemoveItem = (index: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if (confirmDelete) {
      // Lọc bỏ phần tử tại vị trí index
      const newItems = cartItems.filter((_, i) => i !== index);
      setCartItems(newItems);
      updateLocalStorage(newItems);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // --- 4. RENDER ---
  if (!isLoaded) return <div className={styles.loading}>Loading cart...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>SHOPPING CART</h1>
        <p>{cartItems.length} items in your bag</p>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is currently empty.</p>
          <Link href="/" className={styles.continueBtn}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.cartContent}>
          {/* CỘT DANH SÁCH SẢN PHẨM */}
          <div className={styles.itemList}>
            <div className={styles.tableHeader}>
              <div className={styles.colProduct}>Product</div>
              <div className={styles.colPrice}>Price</div>
              <div className={styles.colQty}>Quantity</div>
              <div className={styles.colTotal}>Total</div>
              <div className={styles.colAction}></div>
            </div>

            {/* SỬA: Thêm tham số index vào map */}
            {cartItems.map((item, index) => (
              /* SỬA: Key kết hợp ID và Index để React không báo lỗi trùng */
              <div key={`${item.id}-${index}`} className={styles.cartItem}>
                <div className={styles.itemProduct}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/100x120?text=No+Image")}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  </div>
                </div>

                <div className={styles.itemPrice}>
                  {item.price.toLocaleString("vi-VN")} đ
                </div>

                <div className={styles.itemQty}>
                  <div className={styles.qtyControl}>
                    {/* SỬA: Truyền index vào hàm xử lý */}
                    <button onClick={() => handleQuantityChange(index, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                  </div>
                </div>

                <div className={styles.itemTotal}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </div>

                <div className={styles.itemAction}>
                  {/* SỬA: Truyền index vào hàm xóa */}
                  <button onClick={() => handleRemoveItem(index)} className={styles.removeBtn}>
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.backLinkWrapper}>
              <Link href="/" className={styles.backLink}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* CỘT TỔNG TIỀN (SUMMARY) */}
          <div className={styles.summaryBox}>
            <h2>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.shippingNote}>Calculated at checkout</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            
            <p className={styles.taxNote}>Taxes and shipping calculated at checkout</p>

            <Link 
              href="/customer/checkout" 
              className={styles.checkoutBtn}
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}