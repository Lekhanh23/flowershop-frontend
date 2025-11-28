"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Định nghĩa các màu sắc giống trong ảnh
const COLORS = {
  sales: "#c3e6cb", 
  bestSelling: ["#f48fb1", "#ffe082", "#64b5f6", "#ffb74d", "#ba68c8"],
  status: {
    pending: "#a5d6a7", 
    shipped: "#ef9a9a", 
    delivered: "#90caf9", 
    cancelled: "#bdbdbd" 
  },
  rating: "#f8c6a6" 
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;
  if (!stats) return <div className={styles.loading}>Không có dữ liệu.</div>;

  // --- XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ ---

  // 1. Sales Report
  const salesData = (stats.charts?.salesReport || []).map((item: any) => ({
    name: new Date(item.date).toLocaleDateString('en-GB').slice(0, 5), // dd/mm
    sales: Number(item.total)
  }));

  // 2. Best Selling Products
  const bestSellingData = (stats.charts?.bestSellingProducts || []).map((item: any) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name, // Cắt tên nếu dài
    quantity: Number(item.sold_quantity),
    fullName: item.name
  }));

  // 3. Order Status (Pie Chart)
  const statusData = (stats.charts?.orderStatusDist || []).map((item: any) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Viết hoa chữ cái đầu
    value: Number(item.count)
  }));
  console.log("Status Data for Pie Chart:", statusData);
  // 4. Average Rating
  const ratingData = (stats.charts?.topRatedProducts || []).map((item: any) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    rating: Number(item.avg_rating),
    fullName: item.name
  }));

  // Custom Tooltip để hiển thị số liệu đẹp hơn
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{`${label || payload[0].payload.fullName}`}</p>
          <p className={styles.tooltipValue}>{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>

      {/* --- ROW 1: STAT CARDS --- */}
      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Total Revenue</div>
          <div className={styles.cardValueRevenue}>{formatPrice(stats.cards.totalRevenue)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Number of Products</div>
          <div className={styles.cardValue}>{stats.cards.totalProducts}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Number of Collections</div>
          <div className={styles.cardValue}>{stats.cards.totalCollections}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Total Orders</div>
          <div className={styles.cardValue}>{stats.cards.totalOrders}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Low-stock Alerts</div>
          <div className={styles.cardValue} style={{color: '#c62828'}}>{stats.cards.lowStockCount}</div>
        </div>
      </div>

      {/* --- ROW 2: CHARTS --- */}
      <div className={styles.chartsGrid}>
        
        {/* Chart 1: Sales Report */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Sales Report <span className={styles.badge}>Daily</span></h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="sales" name="Sales (VND)" fill={COLORS.sales} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Best Selling Products */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Best-selling Products</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={bestSellingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 11}} interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="quantity" name="Sold Quantity">
                  {bestSellingData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS.bestSelling[index % COLORS.bestSelling.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Order Status Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Order Status Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {statusData.map((entry: any, index: number) => {
                    const statusKey = entry.name.toLowerCase();
                    // @ts-ignore
                    const color = COLORS.status[statusKey] || "#8884d8";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Average Rating */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Average Rating per Product</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 11}} interval={0} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="rating" name="Average Rating" fill={COLORS.rating} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}