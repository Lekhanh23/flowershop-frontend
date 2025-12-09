"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import api from '@/lib/api'; 

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

  // --- 1. LOAD DỮ LIỆU KHI VÀO TRANG ---
  useEffect(() => {
    setIsClient(true);

    // A. Hàm lấy giỏ hàng
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart'); 
        if (res.data.length === 0) {
            alert("Giỏ hàng của bạn đang trống.");
            router.push('/customer/cart');
        }
        setCartItems(res.data);
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      }
    };

    // B. Hàm lấy thông tin User để điền vào Form
    const fetchUserProfile = async () => {
        try {
            // API lấy profile
            const res = await api.get('/users/profile');
            const user = res.data;

            if (user) {
                // Xử lý tách Full Name thành First/Last Name (tương đối)
                const nameParts = (user.full_name || '').trim().split(' ');
                const lastName = nameParts.length > 1 ? nameParts.pop() : '';
                const firstName = nameParts.join(' ');

                setFormData(prev => ({
                    ...prev,
                    firstName: firstName || user.full_name, // Nếu ko tách được thì để hết vào First Name
                    lastName: lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    // Các trường khác giữ nguyên mặc định
                }));
            }
        } catch (error) {
            console.error("Không lấy được thông tin user:", error);
            // Không chặn lại, người dùng có thể tự nhập tay
        }
    };

    // Gọi song song cả 2 API
    Promise.all([fetchCart(), fetchUserProfile()]).finally(() => setLoading(false));

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
      const res = await api.post('/orders');
      alert(`Đặt hàng thành công! Mã đơn hàng: #${res.data.id}`);
      router.push('/customer/profile');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  if (!isClient || loading) return <div className={styles.container}>Loading info...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Complete your purchase</h1>

      <form onSubmit={handleSubmit} className={styles.wrapper}>
        
        {/* CỘT TRÁI: THÔNG TIN */}
        <div className={styles.leftColumn}>
          <h2 className={styles.sectionTitle}>Payment Information</h2>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
                <input 
                    type="text" name="firstName" placeholder="First name" required 
                    value={formData.firstName} onChange={handleChange} 
                />
            </div>
            <div className={styles.inputGroup}>
                <input 
                    type="text" name="lastName" placeholder="Last name" required 
                    value={formData.lastName} onChange={handleChange} 
                />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <input 
                type="text" name="country" placeholder="Country/ Area" required 
                value={formData.country} onChange={handleChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
                type="text" name="address" placeholder="Address" required 
                value={formData.address} onChange={handleChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
                type="text" name="postcode" placeholder="Postcode" 
                value={formData.postcode} onChange={handleChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
                type="text" name="city" placeholder="State/ City" required 
                value={formData.city} onChange={handleChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
                type="tel" name="phone" placeholder="Phone number" required 
                value={formData.phone} onChange={handleChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
                type="email" name="email" placeholder="Email" required 
                value={formData.email} onChange={handleChange} 
            />
          </div>

          <h2 className={styles.sectionTitle} style={{marginTop: 40}}>Additional Information</h2>
          <div className={styles.inputGroup}>
            <textarea 
                name="note" placeholder="Order notes..." rows={5} 
                value={formData.note} onChange={handleChange}
            ></textarea>
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
                
                <tr className={styles.totalRow}>
                  <td colSpan={2}>Total</td>
                  <td align="right" className={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')}₫</td>
                </tr>
              </tbody>
            </table>

            <h3 className={styles.paymentTitle}>Payment method</h3>
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
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleCheckChange} />
                <label>I agree to terms & conditions</label>
              </div>
              <div className={styles.checkboxRow}>
                <input type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleCheckChange} />
                <label>I agree to privacy policy</label>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>Place order</button>
          </div>
        </div>
      </form>
    </div>
  );
}