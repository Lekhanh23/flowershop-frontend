"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './TargetChart.module.css'; // Import CSS

const RADIAL_COLORS = ['#3B82F6', '#E5E7EB']; // Màu xanh, Màu xám nền

// Dữ liệu mẫu (sẽ được thay thế)
const data = [
  { name: 'Achieved', value: 75.55 },
  { name: 'Remaining', value: 100 - 75.55 },
];

export default function TargetChart() {
  // TODO: Thay thế các giá trị này bằng SWR fetch
  const percentage = 75.55;
  const target = "20K";
  const revenue = "258.000";
  const today = "20K";

  const chartData = [
    { name: 'Achieved', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Phần biểu đồ tròn (Gauge) */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            dataKey="value"
            innerRadius={80} // <-- Tạo lỗ rỗng
            outerRadius={100} // <-- Độ dày
            startAngle={180} // Bắt đầu từ bên trái
            endAngle={0} // Kết thúc ở bên phải
            cornerRadius={10} // Bo góc
            paddingAngle={-10} // (Tùy chọn: tạo khoảng cách nhỏ)
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={RADIAL_COLORS[index % RADIAL_COLORS.length]} 
                stroke={RADIAL_COLORS[index % RADIAL_COLORS.length]} // Bỏ viền
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Chữ ở giữa biểu đồ */}
      <div className={styles.chartCenterText}>
        <div className={styles.percentValue}>{percentage.toFixed(2)}%</div>
        <div className={styles.percentLabel}>Monthly Target</div>
      </div>

      {/* Phần text ở dưới */}
      <div className={styles.footer}>
        <div className={styles.footerItem}>
          <div className={styles.footerLabel}>Target</div>
          <div className={styles.footerValue}>${target}</div>
        </div>
        <div className={styles.footerItem}>
          <div className={styles.footerLabel}>Revenue</div>
          <div className={styles.footerValue}>{revenue}</div>
        </div>
        <div className={styles.footerItem}>
          <div className={styles.footerLabel}>Today</div>
          <div className={styles.footerValue}>${today}</div>
        </div>
      </div>
    </div>
  );
}