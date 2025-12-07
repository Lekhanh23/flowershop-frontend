"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';
import { getImageUrl } from '@/lib/utils';

// --- CẤU HÌNH ---
const BACKEND_URL = 'http://localhost:3000';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

// Giả lập dữ liệu các loại thiệp (Vì database chưa chắc có bảng cards)
const CARD_OPTIONS = [
  { id: 'none', name: 'No Card', price: 0, image: 'https://placehold.co/150x150?text=No+Card' },
  { id: 'cardA', name: 'Card A', price: 30000, image: '/images/card1.png' }, // Thay ảnh thật của bạn
  { id: 'cardB', name: 'Card B', price: 20000, image: 'https://placehold.co/150x150/d0d0d0/333?text=Card+B' },
  { id: 'cardC', name: 'Card C', price: 25000, image: 'https://placehold.co/150x150/c0c0c0/333?text=Card+C' },
];

export default function ProductDetailPage() {
  const params = useParams(); // Lấy ID từ URL
  const router = useRouter();
  
  // State dữ liệu
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State người dùng chọn
  const [quantity, setQuantity] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState<string>('none');
  const [note, setNote] = useState('');
  
  // Lấy id từ URL (chú ý params.id có thể là string hoặc array)
  const productId = params?.id;

  // --- 1. FETCH DATA ---
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Gọi API lấy danh sách (hoặc gọi API chi tiết nếu backend hỗ trợ: /api/products/${productId})
        const response = await fetch(`${BACKEND_URL}/api/products`); 
        const data = await response.json();
        
        const list = Array.isArray(data) ? data : data.data || [];
        
        // Tìm sản phẩm đúng ID
        const found = list.find((p: any) => p.id == productId);
        
        if (found) {
          setProduct(found);
        } else {
          console.error("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // --- 2. LOGIC TÍNH TIỀN ---
  const selectedCard = CARD_OPTIONS.find(c => c.id === selectedCardId);
  const cardPrice = selectedCard ? selectedCard.price : 0;
  const productPrice = product ? Number(product.price) : 0;
  
  // Đã xóa biến deliveryFee = 15000 ở đây

  // Tính tổng tiền chỉ bao gồm giá sản phẩm và giá thiệp
  const totalPrice = (productPrice * quantity) + cardPrice;

  // --- 4. HÀNH ĐỘNG ---
  const handleAddToCart = () => {
    if (!product) return;

    // Tạo object item để lưu
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      card: selectedCard,
      note: note,
      totalItemPrice: (productPrice * quantity) + cardPrice
    };

    // Lấy giỏ hàng cũ từ LocalStorage
    const currentCartJson = localStorage.getItem('cart');
    let currentCart = currentCartJson ? JSON.parse(currentCartJson) : [];

    // Thêm món mới vào
    currentCart.push(cartItem);

    // Lưu lại
    localStorage.setItem('cart', JSON.stringify(currentCart));

    alert('Đã thêm vào giỏ hàng thành công!');
  };

  const handleBuyNow = () => {
    handleAddToCart(); // Thêm vào giỏ trước
    router.push('/customer/cart'); // Chuyển trang sang Cart
  };

  // --- RENDER ---
  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Loading...</div>;
  if (!product) return <div style={{padding: 50, textAlign: 'center'}}>Product not found!</div>;

  return (
    <div className={styles.container}>
      {/* Header nhỏ phía trên */}
      <div className={styles.topBar}>
        JOYFUL WISHES | {productPrice.toLocaleString('vi-VN')} VNĐ
      </div>

      <div className={styles.wrapper}>
        
        {/* === CỘT TRÁI: ẢNH === */}
        <div className={styles.leftColumn}>
          <div className={styles.rating}>
            <span className={styles.stars}>★★★★★</span> (540) View more
          </div>
          
          <div className={styles.mainImageWrapper}>
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className={styles.mainImage} 
            />
          </div>

          {/* Ảnh nhỏ (Thumbnails - Demo dùng lại ảnh chính vì DB chỉ có 1 ảnh) */}
          <div className={styles.thumbnails}>
             <button className={`${styles.thumbBtn} ${styles.active}`}>
               <img src={getImageUrl(product.image)} className={styles.thumbImg} alt="thumb 1" />
             </button>
             <button className={styles.thumbBtn}>
               <img src="https://placehold.co/100x100?text=Angle+2" className={styles.thumbImg} alt="thumb 2" />
             </button>
             <button className={styles.thumbBtn}>
               <img src="https://placehold.co/100x100?text=Angle+3" className={styles.thumbImg} alt="thumb 3" />
             </button>
          </div>
        </div>

        {/* === CỘT PHẢI: THÔNG TIN === */}
        <div className={styles.rightColumn}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          
          {/* Vạch kẻ và Mô tả */}
          <div className={styles.description}>
            {product.description || "Một bó hoa tươi thắm mang lại niềm vui cho người nhận. Thiết kế theo phong cách Paris sang trọng."}
          </div>

          {/* Chọn số lượng */}
          <div className={styles.sectionTitle}>Pick a quantity</div>
          <div className={styles.quantitySelector}>
            <button 
              className={styles.qtyBtn} 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >-</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button 
              className={styles.qtyBtn}
              onClick={() => setQuantity(q => q + 1)}
            >+</button>
          </div>

          {/* Chọn thiệp */}
          <div className={styles.sectionTitle}>Pick a card (optional)</div>
          <div className={styles.cardList}>
            {CARD_OPTIONS.map((card) => (
              <div 
                key={card.id} 
                className={`${styles.cardOption} ${selectedCardId === card.id ? styles.selected : ''}`}
                onClick={() => setSelectedCardId(card.id)}
              >
                <img src={card.image} alt={card.name} className={styles.cardImg} />
                <div className={styles.cardInfo}>
                  <span className={styles.cardName}>{card.name}</span>
                  <span className={styles.cardPrice}>
                    {card.price > 0 ? `+ ${card.price.toLocaleString()} VNĐ` : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lời nhắn */}
          <div className={styles.sectionTitle}>Leave a sweet note (if you're adding a card 💌)</div>
          <input 
            type="text" 
            className={styles.noteInput} 
            placeholder="Type your message here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* Nút bấm */}
          <div className={styles.actionButtons}>
            <button className={`${styles.btn} ${styles.addToCart}`} onClick={handleAddToCart}>
              Add to cart
            </button>
            <button className={`${styles.btn} ${styles.buyNow}`} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Tổng kết tiền */}
          <div className={styles.summary}>
            {/* Đã xóa dòng Delivery Fee ở đây */}
            <span className={styles.totalPrice}>Total: {totalPrice.toLocaleString()} VNĐ</span>
          </div>

        </div>
      </div>
    </div>
  );
}