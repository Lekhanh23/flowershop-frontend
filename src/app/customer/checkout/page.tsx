"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

// Kiểu dữ liệu giỏ hàng
interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  card?: { id: string; name: string; price: number };
  note?: string;
  totalItemPrice: number;
}

export default function CheckoutPage() {
  // State Form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    postcode: '',
    city: '',
    phone: '',
    email: '',
    note: '',
    paymentMethod: 'online',
    termsAccepted: false,
    privacyAccepted: false,
  });

  // State Giỏ hàng (Đọc từ localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // --- 1. LẤY GIỎ HÀNG TỪ LOCALSTORAGE KHI LOAD TRANG ---
  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Kiểm tra nếu là mảng thì set, không thì để rỗng
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error("Lỗi đọc giỏ hàng", error);
        setCartItems([]);
      }
    }
  }, []);

  // --- 2. TÍNH TỔNG TIỀN ĐỘNG ---
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.totalItemPrice || 0), 0);

  // --- XỬ LÝ FORM ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Giỏ hàng đang trống!");
    if (!formData.termsAccepted || !formData.privacyAccepted) return alert("Vui lòng đồng ý điều khoản!");

    // Payload gửi Backend
    const payload = {
      customer: { ...formData },
      items: cartItems,
      totalAmount: totalAmount
    };

    console.log("Submitting Order:", payload);
    alert("Đặt hàng thành công! (Xem console để thấy data)");
    // Xóa giỏ hàng sau khi đặt thành công
    // localStorage.removeItem('cart');
    // setCartItems([]);
  };

  if (!isClient) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Complete your purchase</h1>

      <form onSubmit={handleSubmit} className={styles.wrapper}>
        
        {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG */}
        <div className={styles.leftColumn}>
          <h2 className={styles.sectionTitle}>Payment Information</h2>
          <div className={styles.row}>
            <div className={styles.inputGroup}><input type="text" name="firstName" placeholder="First name" required onChange={handleChange} /></div>
            <div className={styles.inputGroup}><input type="text" name="lastName" placeholder="Last name" required onChange={handleChange} /></div>
          </div>
          <div className={styles.inputGroup}><input type="text" name="country" placeholder="Country/ Area" required onChange={handleChange} /></div>
          <div className={styles.inputGroup}><input type="text" name="address" placeholder="Address" required onChange={handleChange} /></div>
          <div className={styles.inputGroup}><input type="text" name="postcode" placeholder="Postcode" onChange={handleChange} /></div>
          <div className={styles.inputGroup}><input type="text" name="city" placeholder="State/ City" required onChange={handleChange} /></div>
          <div className={styles.inputGroup}><input type="tel" name="phone" placeholder="Phone number" required onChange={handleChange} /></div>
          <div className={styles.inputGroup}><input type="email" name="email" placeholder="Email" required onChange={handleChange} /></div>

          <h2 className={styles.sectionTitle} style={{marginTop: 40}}>Additional Information</h2>
          <div className={styles.inputGroup}>
            <textarea name="note" placeholder="Order notes..." rows={5} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT ĐƠN HÀNG */}
        <div className={styles.rightColumn}>
          <div className={styles.orderBox}>
            <h2 className={styles.boxTitle}>Your order</h2>
            
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th align="left">Products</th>
                  <th align="center">Quantity</th>
                  <th align="right">Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr><td colSpan={3} style={{textAlign: 'center', padding: 20}}>Empty Cart</td></tr>
                ) : (
                  cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className={styles.prodName}>
                        {item.name}
                        {item.card && <div style={{fontSize: '0.8em', color: '#555'}}>+ {item.card.name}</div>}
                      </td>
                      <td align="center">{item.quantity}</td>
                      <td align="right" className={styles.price}>{item.totalItemPrice.toLocaleString('vi-VN')}₫</td>
                    </tr>
                  ))
                )}
                
                {/* Hàng tổng tiền */}
                <tr className={styles.totalRow}>
                  <td colSpan={2}>Total</td>
                  <td align="right" className={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')}₫</td>
                </tr>
              </tbody>
            </table>

            <h3 className={styles.paymentTitle}>Payment method</h3>
            {/* Payment Options */}
            <div className={styles.paymentOption}>
              <div className={styles.radioRow}>
                <input type="radio" id="online" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={handleCheckChange} />
                <label htmlFor="online">Pay online</label>
              </div>
              {formData.paymentMethod === 'online' && (
                <div className={styles.qrContainer}>
                   <p className={styles.qrNote}>Please transfer via QR code below.</p>
                   <img src="https://img.vietqr.io/image/VCB-123456789-compact2.png" alt="QR" className={styles.qrImage} />
                </div>
              )}
            </div>
            
            <div className={styles.paymentOption}>
              <div className={styles.radioRow}>
                <input type="radio" id="cash" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleCheckChange} />
                <label htmlFor="cash">Cash</label>
              </div>
            </div>

            <div className={styles.termsGroup}>
              <div className={styles.checkboxRow}>
                <input type="checkbox" name="termsAccepted" onChange={handleCheckChange} />
                <label>I agree to terms & cogitnditions</label>
              </div>
              <div className={styles.checkboxRow}>
                <input type="checkbox" name="privacyAccepted" onChange={handleCheckChange} />
                <label>I agree to privacy policy</label>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>Place order</button>
          </div>
          <p className={styles.footerNote}>Privacy policy note...</p>
        </div>
      </form>
    </div>
  );
}