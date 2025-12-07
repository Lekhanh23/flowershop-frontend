"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

// Cấu hình backend
const BACKEND_URL = 'http://localhost:3000';

// Data giả lập cho phần chọn Thiệp
const CARD_OPTIONS = [
  { id: 'cardA', name: 'Card A', price: 30000, img: 'https://placehold.co/150x150?text=Card+A' },
  { id: 'cardB', name: 'Card B', price: 20000, img: 'https://placehold.co/150x150?text=Card+B' },
  { id: 'cardC', name: 'Card C', price: 25000, img: 'https://placehold.co/150x150?text=Card+C' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; 

  // State
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  // --- 1. LẤY DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        
        const found = list.find((p: any) => p.id == id);
        setProduct(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // --- 2. HÀM XỬ LÝ ẢNH ---
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "https://placehold.co/500x600?text=No+Image";
    if (imageName.startsWith('http')) return imageName;
    const cleanName = imageName.startsWith('/') ? imageName.slice(1) : imageName;
    return `${BACKEND_URL}/img/${cleanName}`;
  };

  // --- 3. TÍNH TOÁN GIÁ (KHÔNG CÓ SHIP) ---
  const getTotalPrice = () => {
    if (!product) return 0;
    const itemPrice = Number(product.price) * quantity;
    const cardPrice = selectedCardId ? (CARD_OPTIONS.find(c => c.id === selectedCardId)?.price || 0) : 0;
    return itemPrice + cardPrice;
  };

  // --- 4. LƯU VÀO LOCALSTORAGE ---
  const handleAddToCart = () => {
    if (!product) return;

    // Tìm thiệp đã chọn
    const selectedCard = selectedCardId ? CARD_OPTIONS.find(c => c.id === selectedCardId) : null;

    // Tạo object món hàng
    const newItem = {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: quantity,
        card: selectedCard, 
        note: note,
        totalItemPrice: getTotalPrice() 
    };

    // Lấy giỏ cũ & Thêm mới
    const currentCartJson = localStorage.getItem('cart');
    const currentCart = currentCartJson ? JSON.parse(currentCartJson) : [];
    currentCart.push(newItem);

    // Lưu lại
    localStorage.setItem('cart', JSON.stringify(currentCart));

    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart(); 
    router.push('/cart'); // Hoặc '/checkout' tùy đường dẫn của bạn
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (!product) return <div className={styles.loading}>Không tìm thấy sản phẩm!</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        JOYFUL WISHES | {Number(product.price).toLocaleString('vi-VN')} VNĐ
      </div>

      <div className={styles.wrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.ratingInfo}>
            <span className={styles.stars}>★★★★★</span> 
            <span>(540) View more</span>
          </div>
          <div className={styles.mainImageFrame}>
            <img src={getImageUrl(product.image)} alt={product.name} className={styles.mainImg} />
          </div>
          {/* Thumbnails demo */}
          <div className={styles.thumbnails}>
            <div className={`${styles.thumb} ${styles.active}`}><img src={getImageUrl(product.image)} alt="" /></div>
            <div className={styles.thumb}><img src="https://placehold.co/100x100?text=2" alt="" /></div>
            <div className={styles.thumb}><img src="https://placehold.co/100x100?text=3" alt="" /></div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.divider}></div>
          <p className={styles.description}>
            {product.description || "Mô tả sản phẩm mặc định..."}
          </p>
          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Pick a quantity</div>
          <div className={styles.qtyControl}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <div className={styles.sectionTitle}>Pick a card (optional)</div>
          <div className={styles.cardList}>
            {CARD_OPTIONS.map(card => (
              <div 
                key={card.id}
                className={`${styles.cardItem} ${selectedCardId === card.id ? styles.cardSelected : ''}`}
                onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
              >
                <img src={card.img} alt={card.name} />
                <div className={styles.cardInfo}>
                  <div>{card.name}</div>
                  <div className={styles.cardPrice}>+{card.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sectionTitle}>Leave a sweet note 💌</div>
          <input 
            className={styles.noteInput} 
            placeholder="Viết lời chúc..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className={styles.actions}>
            <button className={styles.btnAdd} onClick={handleAddToCart}>Add to cart</button>
            <button className={styles.btnBuy} onClick={handleBuyNow}>Buy Now</button>
          </div>

          <div className={styles.summary}>
            <span className={styles.totalText}>Total: {getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>
      </div>
    </div>
  );
}