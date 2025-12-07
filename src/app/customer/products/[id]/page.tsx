"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

// Cấu hình backend
const BACKEND_URL = 'http://localhost:3000';

// Định nghĩa kiểu dữ liệu cho Service (Thiệp/Dịch vụ)
interface Service {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Định nghĩa kiểu dữ liệu cho Product
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; 

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [cardOptions, setCardOptions] = useState<Service[]>([]); // State chứa danh sách thiệp từ DB
  const [loading, setLoading] = useState(true);
  
  // State UI người dùng chọn
  const [quantity, setQuantity] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // ID database là số
  const [note, setNote] = useState('');

  // --- 1. LẤY DỮ LIỆU TỪ API (Product & Services) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // A. Gọi API lấy thông tin Sản phẩm
        const prodRes = await fetch(`${BACKEND_URL}/api/products`);
        const prodData = await prodRes.json();
        const prodList = Array.isArray(prodData) ? prodData : prodData.data || [];
        const foundProduct = prodList.find((p: any) => p.id == id);
        setProduct(foundProduct);

        // B. Gọi API lấy danh sách Thiệp (Services)
        // Giả định bạn đã có API: http://localhost:3000/api/services trả về dữ liệu từ bảng services
        const servRes = await fetch(`${BACKEND_URL}/api/services`);
        if (servRes.ok) {
          const servData = await servRes.json();
          // Kiểm tra cấu trúc trả về là mảng hay object { data: [] }
          setCardOptions(Array.isArray(servData) ? servData : servData.data || []);
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // --- 2. HÀM XỬ LÝ ẢNH ---
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "https://placehold.co/500x600?text=No+Image";
    if (imageName.startsWith('http')) return imageName;
    // Xử lý đường dẫn ảnh từ backend (thường lưu tên file)
    const cleanName = imageName.startsWith('/') ? imageName.slice(1) : imageName;
    return `${BACKEND_URL}/img/${cleanName}`;
  };

  // --- 3. TÍNH TOÁN GIÁ ---
  const getTotalPrice = () => {
    if (!product) return 0;
    const itemPrice = Number(product.price) * quantity;
    // Tìm giá thiệp trong danh sách cardOptions đã fetch được
    const selectedCard = selectedCardId ? cardOptions.find(c => c.id === selectedCardId) : null;
    const cardPrice = selectedCard ? Number(selectedCard.price) : 0;
    
    return itemPrice + cardPrice;
  };

  // --- 4. LƯU VÀO LOCALSTORAGE ---
  const handleAddToCart = () => {
    if (!product) return;

    // Tìm thiệp đã chọn từ danh sách thật
    const selectedCard = selectedCardId ? cardOptions.find(c => c.id === selectedCardId) : null;

    // Tạo object món hàng
    const newItem = {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: quantity,
        card: selectedCard, // Lưu cả object card để hiển thị bên Cart
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
    router.push('/cart'); 
  };

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  if (!product) return <div className={styles.loading}>Không tìm thấy sản phẩm!</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        JOYFUL WISHES | {Number(product.price).toLocaleString('vi-VN')} VNĐ
      </div>

      <div className={styles.wrapper}>
        {/* --- CỘT TRÁI: ẢNH --- */}
        <div className={styles.leftColumn}>
          <div className={styles.ratingInfo}>
            <span className={styles.stars}>★★★★★</span> 
            <span>(540) View more</span>
          </div>
          
          {/* Chỉ giữ lại ảnh chính */}
          <div className={styles.mainImageFrame}>
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className={styles.mainImg} 
              onError={(e) => e.currentTarget.src = "https://placehold.co/500x600?text=No+Image"}
            />
          </div>
          
          {/* Đã xóa phần thumbnails (3 ảnh nhỏ) ở đây */}
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN --- */}
        <div className={styles.rightColumn}>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.divider}></div>
          <p className={styles.description}>
            {product.description || "Một bó hoa tươi thắm mang lại niềm vui cho người nhận."}
          </p>
          <div className={styles.divider}></div>

          {/* Chọn số lượng */}
          <div className={styles.sectionTitle}>Pick a quantity</div>
          <div className={styles.qtyControl}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          {/* Chọn thiệp (Render từ dữ liệu thật) */}
          <div className={styles.sectionTitle}>Pick a card (optional)</div>
          <div className={styles.cardList}>
            {cardOptions.length === 0 ? (
              <p style={{fontStyle:'italic', color:'#888'}}>Đang cập nhật danh sách thiệp...</p>
            ) : (
              cardOptions.map(card => (
                <div 
                  key={card.id}
                  className={`${styles.cardItem} ${selectedCardId === card.id ? styles.cardSelected : ''}`}
                  onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
                >
                  <img 
                    src={getImageUrl(card.image)} 
                    alt={card.name} 
                    onError={(e) => e.currentTarget.src = "https://placehold.co/150x150?text=No+Image"}
                  />
                  <div className={styles.cardInfo}>
                    <div>{card.name}</div>
                    <div className={styles.cardPrice}>+{Number(card.price).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
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