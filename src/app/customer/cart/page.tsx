"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function CheckoutPage() {
  // --- STATE DỮ LIỆU ---
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
    paymentMethod: 'online', // Mặc định chọn Pay online theo mẫu
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SẢN PHẨM MẪU (Theo ảnh thiết kế) ---
  const cartItem = {
    id: 101, 
    name: "A boutique of white rose",
    price: 200000,
    quantity: 1
  };
  const totalAmount = cartItem.price * cartItem.quantity;

  // --- HÀM XỬ LÝ ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      alert("Vui lòng đồng ý với điều khoản và chính sách bảo mật.");
      return;
    }

    setIsSubmitting(true);

    // Payload chuẩn gửi Backend NestJS (Map theo DTO của bạn)
    const payload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.country} - Zip: ${formData.postcode}`,
      },
      paymentMethod: formData.paymentMethod,
      note: formData.note,
      totalAmount: totalAmount,
      items: [
        {
          productId: cartItem.id,
          quantity: cartItem.quantity,
          price: cartItem.price
        }
      ]
    };

    console.log("Submitting Order:", payload);

    try {
      // Giả lập API call (Thay bằng fetch thật khi chạy)
      /*
      await fetch('http://localhost:3000/orders', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });
      */
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Đặt hàng thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Tiêu đề chính căn giữa */}
      <h1 className={styles.pageTitle}>Complete your purchase</h1>

      <form onSubmit={handleSubmit} className={styles.wrapper}>
        
        {/* --- CỘT TRÁI: FORM NHẬP LIỆU --- */}
        <div className={styles.leftColumn}>
          <h2 className={styles.sectionTitle}>Payment Information</h2>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input type="text" name="firstName" placeholder="First name" required value={formData.firstName} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <input type="text" name="lastName" placeholder="Last name" required value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input type="text" name="country" placeholder="Country/ Area" required value={formData.country} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <input type="text" name="postcode" placeholder="Postcode" value={formData.postcode} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <input type="text" name="city" placeholder="State/ City" required value={formData.city} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <input type="tel" name="phone" placeholder="Phone number" required value={formData.phone} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
          </div>

          {/* Additional Info Section */}
          <h2 className={styles.sectionTitle} style={{marginTop: '40px'}}>Additional Information</h2>
          <div className={styles.inputGroup}>
            <textarea 
              name="note" 
              placeholder="Note about the order, for instance delivery time or detailed delivery address"
              rows={5}
              value={formData.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* --- CỘT PHẢI: YOUR ORDER (Box viền hồng) --- */}
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
                <tr>
                  <td className={styles.prodName}>{cartItem.name}</td>
                  <td align="center">{cartItem.quantity}</td>
                  <td align="right" className={styles.price}>{cartItem.price.toLocaleString('vi-VN')}₫</td>
                </tr>
                <tr className={styles.totalRow}>
                  <td colSpan={2}>Total</td>
                  <td align="right" className={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')}₫</td>
                </tr>
              </tbody>
            </table>

            <h3 className={styles.paymentTitle}>Payment method</h3>

            {/* Radio: Pay online */}
            <div className={styles.paymentOption}>
              <div className={styles.radioRow}>
                <input 
                  type="radio" 
                  id="online" 
                  name="paymentMethod" 
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={handleCheckChange}
                />
                <label htmlFor="online">Pay online</label>
              </div>
              
              {/* Hiển thị QR Code nếu chọn Pay online */}
              {formData.paymentMethod === 'online' && (
                <div className={styles.qrContainer}>
                  <p className={styles.qrNote}>
                    Make a transfer to our bank account immediately. Please use your Order ID in the Payment Details section. Your order will be shipped after the payment transaction is completed.
                  </p>
                  {/* Link ảnh VietQR mẫu, bạn thay bằng ảnh thật trong thư mục public */}
                  <img 
                    src="https://img.vietqr.io/image/VCB-123456789-compact2.png" 
                    alt="VietQR Code" 
                    className={styles.qrImage} 
                  />
                </div>
              )}
            </div>

            {/* Radio: Cash */}
            <div className={styles.paymentOption}>
              <div className={styles.radioRow}>
                <input 
                  type="radio" 
                  id="cash" 
                  name="paymentMethod" 
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleCheckChange}
                />
                <label htmlFor="cash">Cash</label>
              </div>
            </div>

            {/* Checkboxes Terms */}
            <div className={styles.termsGroup}>
              <div className={styles.checkboxRow}>
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleCheckChange} />
                <label>I have read and agree to the website <a href="#">terms and conditions</a></label>
              </div>
              <div className={styles.checkboxRow}>
                <input type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted} onChange={handleCheckChange} />
                <label>I have read and agree to the website <a href="#">privacy policy</a></label>
              </div>
            </div>

            {/* Button */}
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Place order'}
            </button>
            
          </div>
          
          {/* Footer note */}
          <p className={styles.footerNote}>
            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a href="#">privacy policy</a>.
          </p>
        </div>

      </form>
    </div>
  );
}