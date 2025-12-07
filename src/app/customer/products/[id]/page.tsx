"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { formatPrice, getImageUrl } from '@/lib/utils';

// Cấu hình backend
const BACKEND_URL = 'http://localhost:3000';

// 1. Định nghĩa kiểu dữ liệu cho Service (Card)
interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; 

  const [product, setProduct] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]); 
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [note, setNote] = useState('');

  // --- HÀM MAP ẢNH CHO SERVICE (DÙNG ẢNH LOCAL TRONG PUBLIC/IMAGES) ---
  const getServiceImage = (serviceId: number) => {
    switch (serviceId) {
        case 1: return "/images/card1.png";       
        case 2: return "/images/card2.png";   
        case 3: return "/images/card3.png";   
        default: return "/images/card-default.jpg";   
    }
  };

  // --- 1. LẤY DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [resProduct, resServices] = await Promise.all([
            // Gọi API lấy chi tiết sản phẩm (hoặc danh sách rồi filter nếu chưa có API detail)
            fetch(`${BACKEND_URL}/api/products/${id}`).then(res => {
                if(res.ok) return res.json();
                // Fallback nếu API detail lỗi -> gọi list
                return fetch(`${BACKEND_URL}/api/products?limit=100`)
                    .then(r => r.json())
                    .then(data => {
                        const list = Array.isArray(data.data) ? data.data : [];
                        return list.find((p: any) => p.id == id);
                    });
            }),
            // Gọi API lấy danh sách dịch vụ (Cards)
            fetch(`${BACKEND_URL}/api/services`) 
        ]);

        if (resProduct) {
            setProduct(resProduct);
        }

        if (resServices.ok) {
            const servicesData = await resServices.json();
            setServices(servicesData); 
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // --- 2. TÍNH TOÁN GIÁ ---
  const getTotalPrice = () => {
    if (!product) return 0;
    const itemPrice = Number(product.price) * quantity;
    const selectedService = services.find(s => s.id === selectedServiceId);
    const servicePrice = selectedService ? Number(selectedService.price) : 0;
    return itemPrice + servicePrice;
  };

  // --- 3. HÀNH ĐỘNG ---
  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedService = services.find(s => s.id === selectedServiceId);

    const cartItem = {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: quantity,
        serviceId: selectedServiceId || null, 
        service: selectedService ? {
            id: selectedService.id,
            name: selectedService.name,
            price: Number(selectedService.price)
        } : null,
        note: note,
        totalItemPrice: getTotalPrice()
    };

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Kiểm tra trùng sản phẩm (trùng cả ID sản phẩm và ID dịch vụ)
    const existingItemIndex = currentCart.findIndex((item: any) => 
        item.productId === cartItem.productId && item.serviceId === cartItem.serviceId
    );

    if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += quantity;
        currentCart[existingItemIndex].totalItemPrice += cartItem.totalItemPrice;
    } else {
        currentCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    alert(`Đã thêm ${product.name} ${selectedService ? `(+ ${selectedService.name})` : ''} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/customer/cart'); 
  };

  if (loading) return <div className={styles.container} style={{textAlign:'center', padding: 50}}>Đang tải dữ liệu...</div>;
  if (!product) return <div className={styles.container} style={{textAlign:'center', padding: 50}}>Không tìm thấy sản phẩm!</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        JOYFUL WISHES | {formatPrice(product.price)}
      </div>

      <div className={styles.wrapper}>
        {/* --- CỘT TRÁI: ẢNH --- */}
        <div className={styles.leftColumn}>
          <div className={styles.ratingInfo}>
            <span className={styles.stars}>★★★★★</span> 
            <span>(540) View more</span>
          </div>
          
          <div className={styles.mainImageFrame}>
            <img 
                src={getImageUrl(product.image)} 
                alt={product.name} 
                className={styles.mainImg}
                onError={(e) => e.currentTarget.src = "https://placehold.co/500x600?text=No+Image"}
            />
          </div>

          <div className={styles.thumbnails}>
            <div className={`${styles.thumb} ${styles.active}`}>
              <img src={getImageUrl(product.image)} alt="thumb 1" />
            </div>
            {/* Ảnh thumb phụ họa */}
            <div className={styles.thumb}>
              <img src="https://placehold.co/100x100?text=Angle+2" alt="thumb 2" />
            </div>
            <div className={styles.thumb}>
              <img src="https://placehold.co/100x100?text=Angle+3" alt="thumb 3" />
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN --- */}
        <div className={styles.rightColumn}>
          <h1 className={styles.productName}>{product.name}</h1>
          
          <div className={styles.divider}></div>
          
          <p className={styles.description}>
            {product.description || "Sản phẩm hoa tươi cao cấp, thiết kế theo phong cách hiện đại. Phù hợp tặng sinh nhật, kỷ niệm."}
          </p>

          <div className={styles.divider}></div>

          {/* Chọn số lượng */}
          <div className={styles.sectionTitle}>Pick a quantity</div>
          <div className={styles.qtyControl}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          {/* --- HIỂN THỊ DANH SÁCH THIỆP (SERVICES) --- */}
          <div className={styles.sectionTitle}>Pick a card (optional)</div>
          
          {services.length === 0 ? (
              <p style={{fontSize: 12, color: '#888'}}>Không có dịch vụ đi kèm.</p>
          ) : (
              <div className={styles.cardList}>
                {/* Option KHÔNG chọn thiệp */}
                <div 
                    className={`${styles.cardItem} ${selectedServiceId === null ? styles.cardSelected : ''}`}
                    onClick={() => setSelectedServiceId(null)}
                >
                    {/* Ảnh icon cho lựa chọn "None" */}
                    <img src="/images/no-card.png" 
                         alt="No Card" 
                         onError={(e) => e.currentTarget.src = "https://placehold.co/150x150?text=None"} 
                    />
                    <div className={styles.cardInfo}>
                        <div>No Card</div>
                        <div className={styles.cardPrice}>Free</div>
                    </div>
                </div>

                {/* Danh sách thiệp từ Database */}
                {services.map(service => (
                  <div 
                    key={service.id}
                    className={`${styles.cardItem} ${selectedServiceId === service.id ? styles.cardSelected : ''}`}
                    onClick={() => setSelectedServiceId(service.id === selectedServiceId ? null : service.id)}
                  >
                    {/* Dùng hàm getServiceImage để lấy ảnh từ public/images */}
                    <img 
                        src={getServiceImage(service.id)} 
                        alt={service.name}
                        onError={(e) => e.currentTarget.src = "https://placehold.co/150x150?text=No+Img"} 
                    />
                    <div className={styles.cardInfo}>
                      <div className={styles.cardName} title={service.name}>{service.name}</div>
                      <div className={styles.cardPrice}>+ {formatPrice(service.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
          )}

          {/* Lời nhắn */}
          <div className={styles.sectionTitle}>Leave a sweet note (if you're adding a card 💌)</div>
          <input 
            className={styles.noteInput} 
            placeholder="Viết lời chúc của bạn ở đây..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* Nút bấm */}
          <div className={styles.actions}>
            <button className={styles.btnAdd} onClick={handleAddToCart}>Add to cart</button>
            <button className={styles.btnBuy} onClick={handleBuyNow}>Buy Now</button>
          </div>

          {/* Tổng tiền */}
          <div className={styles.summary}>
            <span className={styles.totalText}>Total: {formatPrice(getTotalPrice())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}