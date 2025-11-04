"use client";

import React from "react";
import styles from "./page.module.css";

// Sample counts taken from your DB screenshot (phpMyAdmin rows)
const DB_COUNTS = {
  users: 4, // customers
  orders: 2,
  products: 15,
  reviews: 3,
};

const monthlySales = [120, 320, 180, 220, 160, 140, 190, 230, 380, 300, 260, 80];

function formatNumber(n: number) {
  return n.toLocaleString();
}

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className={styles.barChart}>
      {data.map((v, i) => (
        <div key={i} className={styles.barWrap}>
          <div className={styles.bar} style={{ height: `${(v / max) * 100}%` }} title={`${v}`} />
          <div className={styles.barLabel}>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}</div>
        </div>
      ))}
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  // value: 0-100
  const angle = (value / 100) * 180;
  return (
    <div className={styles.gauge}>
      <svg viewBox="0 0 200 100" width="200" height="100">
        <path d="M10,90 A90,90 0 0,1 190,90" fill="none" stroke="#eee" strokeWidth="12" />
        <path d={`M10,90 A90,90 0 0,1 ${10 + 180 * (value / 100)},90`} fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
        <text x="100" y="55" textAnchor="middle" fontSize="18" fill="#111">{value.toFixed(2)}%</text>
      </svg>
      <div className={styles.gaugeNote}>Monthly Target</div>
    </div>
  );
}

export default function DashboardPage() {
  // derive some simple KPIs from DB_COUNTS and monthly sales
  const customers = DB_COUNTS.users;
  const orders = DB_COUNTS.orders;
  const revenue = monthlySales.reduce((a, b) => a + b, 0) * 100; // arbitrary multiplier to look realistic

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Customers</div>
          <div className={styles.cardValue}>{formatNumber(customers)}</div>
          <div className={styles.cardDelta}>+11.01%</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Orders</div>
          <div className={styles.cardValue}>{formatNumber(orders)}</div>
          <div className={styles.cardDeltaNegative}>-9.05%</div>
        </div>

        <div className={styles.cardLarge}>
          <div className={styles.cardLabel}>Monthly Sales</div>
          <BarChart data={monthlySales} />
        </div>

        <div className={styles.cardSmall}>
          <Gauge value={75.55} />
          <div className={styles.gaugeFoot}>
            <div>Target<br/><strong>$20K</strong></div>
            <div>Revenue<br/><strong>{formatNumber(revenue)}</strong></div>
            <div>Today<br/><strong>$20K</strong></div>
          </div>
        </div>
      </div>

      <div className={styles.statsSection}>
        <h3>Statistics</h3>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Products</div>
            <div className={styles.statValue}>{DB_COUNTS.products}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Reviews</div>
            <div className={styles.statValue}>{DB_COUNTS.reviews}</div>
          </div>
          <div className={styles.statCardFull}>
            <div className={styles.recentTitle}>Recent Orders</div>
            <table className={styles.recentTable}>
              <thead>
                <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td>1023</td><td>Nguyen A</td><td>$120</td><td>Completed</td></tr>
                <tr><td>1022</td><td>Tran B</td><td>$85</td><td>Pending</td></tr>
                <tr><td>1021</td><td>Le C</td><td>$230</td><td>Completed</td></tr>
                <tr><td>1020</td><td>Pham D</td><td>$42</td><td>Cancelled</td></tr>
                <tr><td>1019</td><td>Hoang E</td><td>$150</td><td>Completed</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
