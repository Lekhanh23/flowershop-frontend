// src/app/admin/orders/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import OrderStatusSelect from '@/components/OrderStatusSelect';
import styles from "./page.module.css";
export const dynamic = 'force-dynamic';

type OrderStatus = 'pending' | 'shipped' | 'delivered';

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { orderDate: 'desc' },
    include: {
      user: {
        select: { full_name: true, email: true, phone: true, addr: true },
      },
    },
  });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Management</h1>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td className = {styles.name}>{o.user?.full_name ?? `User #${o.userId}`}</td>
                <td className = {styles.name}>{o.user?.email ?? '-'}</td>
                <td className = {styles.name}>{o.user?.phone ?? '-'}</td>
                <td className = {styles.name}>{o.user?.addr ?? '-'}</td>
                <td className = {styles.name}>
                  {o.totalAmount.toNumber().toLocaleString('vi-VN')} VND
                </td>
                <td className = {styles.name}>
                  <OrderStatusSelect
                    orderId={o.id}
                    defaultStatus={o.status as OrderStatus}
                  />
                </td>
                <td className = {styles.name}>
                  {o.orderDate ? new Date(o.orderDate).toLocaleString('vi-VN') : '-'}
                </td>
                <td className = {styles.name}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className={styles.deleteBtn}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
