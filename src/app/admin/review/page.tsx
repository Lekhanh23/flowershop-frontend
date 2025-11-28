"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import api from "@/lib/api";
import { FaTrash, FaRegCommentDots } from "react-icons/fa"; 

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Filter
  const [filters, setFilters] = useState({
    user: "",
    product: "",
    date: "",
    rating: "",
  });

  // State cho Reply (Lưu ID của review đang mở khung trả lời)
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // State cho Checkbox
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Gọi API Backend (Có thể thêm params filter vào URL này)
      const res = await api.get('/admin/reviews?limit=50');
      setReviews(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  // Xử lý Filter (Ở đây đang filter trên client để demo nhanh, bạn có thể gọi API)
  const filteredReviews = reviews.filter(r => {
    const matchUser = !filters.user || r.user?.full_name.toLowerCase().includes(filters.user.toLowerCase()) || r.user?.email.includes(filters.user);
    const matchProduct = !filters.product || r.product?.name.toLowerCase().includes(filters.product.toLowerCase());
    // const matchDate = ... (xử lý date nếu cần)
    const matchRating = !filters.rating || String(r.rating) === filters.rating;
    return matchUser && matchProduct && matchRating;
  });

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (e) { alert("Failed to delete"); }
  };

  const handleBulkDelete = () => {
    if(selectedIds.length === 0) return alert("Please select reviews to delete");
    if(!confirm(`Delete ${selectedIds.length} reviews?`)) return;
    // Gọi API xóa nhiều (cần backend hỗ trợ hoặc loop xóa từng cái)
    alert("Chức năng xóa nhiều cần Backend hỗ trợ API Bulk Delete");
  };

  const handleReplySubmit = (id: number) => {
    // Đây là nơi gọi API gửi tin nhắn (Nếu backend có)
    console.log(`Replying to review ${id}: ${replyText}`);
    alert(`Reply sent: ${replyText}`);
    setReplyingId(null);
    setReplyText("");
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) return <div className={styles.container}>Loading reviews...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Review Management</h2>
      <div className={styles.headerRow}>
        <div>Total reviews: <span className={styles.totalCount}>{filteredReviews.length}</span></div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className={styles.filterBar}>
        <input 
          placeholder="User name or email" 
          className={styles.input} 
          value={filters.user}
          onChange={e => setFilters({...filters, user: e.target.value})}
        />
        <input 
          placeholder="Product name" 
          className={styles.input}
          value={filters.product}
          onChange={e => setFilters({...filters, product: e.target.value})}
        />
        <input 
          type="date" 
          className={styles.input}
          value={filters.date}
          onChange={e => setFilters({...filters, date: e.target.value})}
        />
        <select 
          className={styles.select}
          value={filters.rating}
          onChange={e => setFilters({...filters, rating: e.target.value})}
        >
          <option value="">Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <button className={styles.filterBtn}>Filter</button>
      </div>

      <button className={styles.deleteBulkBtn} onClick={handleBulkDelete}>Delete</button>

      {/* --- TABLE --- */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{width: '40px'}}><input type="checkbox" /></th>
              <th style={{width: '60px'}}>ID</th>
              <th>CUSTOMER</th>
              <th>PRODUCT</th>
              <th>RATING</th>
              <th>DATE</th>
              <th>COMMENTS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((r) => (
              <React.Fragment key={r.id}>
                <tr>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                    />
                  </td>
                  <td>{r.id}</td>
                  <td>
                    <span className={styles.userName}>{r.user?.full_name}</span>
                    <span className={styles.userEmail}>{r.user?.email}</span>
                  </td>
                  <td>{r.product?.name}</td>
                  <td><span className={styles.rating}>{renderStars(r.rating)}</span></td>
                  <td>{new Date(r.created_at).toLocaleString('en-GB').split(',')[0]} {new Date(r.created_at).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</td>
                  <td>{r.comment}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.iconBtn} onClick={() => handleDelete(r.id)}>
                        <FaTrash />
                      </button>
                      <button 
                        className={styles.iconBtn} 
                        onClick={() => {
                          if (replyingId === r.id) setReplyingId(null); // Toggle close
                          else setReplyingId(r.id); // Open
                        }}
                      >
                        <FaRegCommentDots />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* --- REPLY ROW (Chỉ hiện khi bấm nút chat) --- */}
                {replyingId === r.id && (
                  <tr className={styles.replyRow}>
                    <td colSpan={8}>
                      <div className={styles.replyBox}>
                        <textarea 
                          className={styles.replyInput} 
                          rows={2} 
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        />
                        <div className={styles.replyActions}>
                          <button className={styles.sendBtn} onClick={() => handleReplySubmit(r.id)}>Send</button>
                          <button className={styles.cancelBtn} onClick={() => setReplyingId(null)}>Cancel</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}