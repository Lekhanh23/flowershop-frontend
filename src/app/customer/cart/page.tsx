"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function CheckoutPage() {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU FORM ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'Vietnam',
    address: '',
    zip: '',
    city: '',
    phone: '',
    email: '',
    note: '',
    paymentMethod: 'bank_transfer', // Mặc định: Chuyển khoản
    termsAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 2. DỮ LIỆU GIỎ HÀNG (MẪU) ---
  const cartItem = {
    id: 101, // productId (Khớp với Backend)
    name: "Bó Hoa Loa Kèn Hà Nội - Mua Bó Hoa Loa Kèn Tặng Sinh Nhật",
    price: 500000,
    quantity: 1
  };
  const totalAmount = cartItem.price * cartItem.quantity;

  // --- 3. CÁC HÀM XỬ LÝ SỰ KIỆN ---
  
  // Xử lý khi nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý khi chọn Radio hoặc Checkbox
  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Xử lý khi bấm nút "ĐẶT HÀNG"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Vui lòng đồng ý với điều khoản và điều kiện.");
      return;
    }

    setIsSubmitting(true);

    // --- CHUẨN BỊ PAYLOAD (Cấu trúc dữ liệu gửi đi) ---
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.country}`;
    
    const payload = {
      // Thông tin khách hàng (Object 'customer')
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: fullAddress,
      },

      // Thông tin đơn hàng
      paymentMethod: formData.paymentMethod,
      note: formData.note,
      totalAmount: totalAmount,

      // Danh sách sản phẩm (Mảng 'items')
      items: [
        {
          productId: cartItem.id, // ID sản phẩm
          quantity: cartItem.quantity,
          price: cartItem.price 
        }
      ]
    };

    console.log("LOG: Dữ liệu gửi đi Backend:", payload);

    try {
      // --- GỌI API (Bỏ comment khi chạy thật) ---
      /*
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Lỗi khi gọi API đặt hàng');
      */

      // Giả lập delay 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Đặt hàng thành công!\n(Dữ liệu JSON đã được log trong Console F12)`);
      
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. GIAO DIỆN (JSX) ---
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.wrapper}>
        
        {/* --- CỘT TRÁI: FORM NHẬP THÔNG TIN --- */}
        <div className={styles.leftColumn}>
          <h2 className={styles.heading}>Thông tin thanh toán</h2>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Tên *</label>
              <input type="text" name="firstName" required placeholder="Nhập tên" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Họ *</label>
              <input type="text" name="lastName" required placeholder="Nhập họ" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Quốc gia/Khu vực *</label>
            <select name="country" value={formData.country} onChange={handleChange} className={styles.select}>
              <option value="Vietnam">Việt Nam</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Địa chỉ *</label>
            <input type="text" name="address" placeholder="Số nhà, tên đường..." required value={formData.address} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Mã bưu điện</label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Tỉnh / Thành phố *</label>
            <input type="text" name="city" required value={formData.city} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Số điện thoại *</label>
            <input type="tel" name="phone" required placeholder="Ví dụ: 0912345678" value={formData.phone} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Địa chỉ email *</label>
            <input type="email" name="email" required placeholder="email@example.com" value={formData.email} onChange={handleChange} />
          </div>

          <h2 className={styles.heading} style={{marginTop: '30px'}}>Thông tin bổ sung</h2>
          <div className={styles.inputGroup} style={{marginBottom: 0}}>
            <textarea name="note" rows={5} placeholder="Ghi chú về đơn hàng..." value={formData.note} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN ĐƠN HÀNG --- */}
        <div className={styles.rightColumn}>
          <div className={styles.orderBox}>
            <h2 className={styles.heading}>Đơn hàng của bạn</h2>
            
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th style={{textAlign: 'left'}}>SẢN PHẨM</th>
                  <th style={{textAlign: 'right'}}>TẠM TÍNH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.productName}>
                    {cartItem.name} <strong style={{whiteSpace: 'nowrap'}}>× {cartItem.quantity}</strong>
                  </td>
                  <td className={styles.productPrice}>
                    {cartItem.price.toLocaleString('vi-VN')}₫
                  </td>
                </tr>
                <tr className={styles.subtotalRow}>
                  <td>Tạm tính</td>
                  <td><strong>{totalAmount.toLocaleString('vi-VN')}₫</strong></td>
                </tr>
                <tr className={styles.totalRow}>
                  <td>Tổng</td>
                  <td className={styles.productPrice}>{totalAmount.toLocaleString('vi-VN')}₫</td>
                </tr>
              </tbody>
            </table>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div className={styles.paymentMethods}>
              <div className={styles.radioGroup}>
                <input type="radio" id="bank" name="paymentMethod" value="bank_transfer" checked={formData.paymentMethod === 'bank_transfer'} onChange={handleCheckChange} />
                <label htmlFor="bank">Chuyển khoản ngân hàng</label>
              </div>
              
              {formData.paymentMethod === 'bank_transfer' && (
                <div className={styles.paymentDesc}>
                  Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán.
                </div>
              )}

              <div className={styles.radioGroup} style={{marginTop: '15px'}}>
                <input type="radio" id="cod" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleCheckChange} />
                <label htmlFor="cod">Trả tiền mặt khi nhận hàng</label>
              </div>
            </div>

            <div className={styles.terms}>
              <input type="checkbox" id="terms" name="termsAccepted" checked={formData.termsAccepted} onChange={handleCheckChange} />
              <label htmlFor="terms">Tôi đã đọc và đồng ý với <a href="#">điều khoản và điều kiện</a> *</label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
            </button>
            
            <p className={styles.privacyText}>
              Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và cho các mục đích khác được mô tả trong <a href="#">chính sách riêng tư</a>.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}