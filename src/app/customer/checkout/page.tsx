"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import api from '@/lib/api'; // Import instance API đã cấu hình

// Interface khớp với dữ liệu từ Backend trả về
interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string | number;
    image: string;
  };
  service?: {
    id: number;
    name: string;
    price: string | number;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  
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

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 1. LẤY GIỎ HÀNG TỪ API KHI LOAD TRANG ---
  useEffect(() => {
    setIsClient(true);
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart'); //
        if (res.data.length === 0) {
            alert("Giỏ hàng của bạn đang trống.");
            router.push('/customer/cart');
        }
        setCartItems(res.data);
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [router]);

  // --- 2. TÍNH TỔNG TIỀN ---
  const totalAmount = cartItems.reduce((sum, item) => {
    const productPrice = Number(item.product.price);
    const servicePrice = item.service ? Number(item.service.price) : 0;
    return sum + (productPrice + servicePrice) * item.quantity;
  }, 0);

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

    try {
      // Gọi API tạo đơn hàng (Backend sẽ tự lấy items từ giỏ hàng trong DB)
      //
      const res = await api.post('/orders');
      
      alert(`Đặt hàng thành công! Mã đơn hàng: #${res.data.id}`);
      
      // Chuyển hướng sang trang Profile để xem lịch sử đơn
      router.push('/customer/profile');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  if (!isClient || loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Complete your purchase</h1>

      <form onSubmit={handleSubmit} className={styles.wrapper}>
        
        {/* CỘT TRÁI: GIỮ NGUYÊN GIAO DIỆN FORM INPUT */}
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

        {/* CỘT PHẢI: CHI TIẾT ĐƠN HÀNG (Render dữ liệu từ API nhưng giữ class cũ) */}
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
                {cartItems.map((item, index) => {
                    const itemTotal = (Number(item.product.price) + (item.service ? Number(item.service.price) : 0)) * item.quantity;
                    return (
                        <tr key={index}>
                        <td className={styles.prodName}>
                            {item.product.name}
                            {item.service && <div style={{fontSize: '0.8em', color: '#555'}}>+ {item.service.name}</div>}
                        </td>
                        <td align="center">{item.quantity}</td>
                        <td align="right" className={styles.price}>{itemTotal.toLocaleString('vi-VN')}₫</td>
                        </tr>
                    );
                })}
                
                {/* Hàng tổng tiền */}
                <tr className={styles.totalRow}>
                  <td colSpan={2}>Total</td>
                  <td align="right" className={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')}₫</td>
                </tr>
              </tbody>
            </table>

            <h3 className={styles.paymentTitle}>Payment method</h3>
            {/* Payment Options - Giữ nguyên logic QR code */}
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
                <label>I agree to terms & conditions</label>
              </div>
              <div className={styles.checkboxRow}>
                <input type="checkbox" name="privacyAccepted" onChange={handleCheckChange} />
                <label>I agree to privacy policy</label>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>Place order</button>
          </div>
          <p className={styles.footerNote}>Your personal data will be used to process your order...</p>
        </div>
      </form>
    </div>
  );
}