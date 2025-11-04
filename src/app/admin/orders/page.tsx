// src/app/admin/orders/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import OrderStatusSelect from '@/components/OrderStatusSelect';

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
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-pink-600 mb-6">Order Management</h1>

      <div className="overflow-x-auto rounded-2xl shadow-sm border">
        <table className="min-w-full text-sm">
          <thead className="bg-pink-50 text-pink-700">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-3">{o.id}</td>
                <td className="px-4 py-3">{o.user?.full_name ?? `User #${o.userId}`}</td>
                <td className="px-4 py-3">{o.user?.email ?? '-'}</td>
                <td className="px-4 py-3">{o.user?.phone ?? '-'}</td>
                <td className="px-4 py-3">{o.user?.addr ?? '-'}</td>
                <td className="px-4 py-3">
                  {o.totalAmount.toNumber().toLocaleString('vi-VN')} VND
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect
                    orderId={o.id}
                    defaultStatus={o.status as OrderStatus}
                  />
                </td>
                <td className="px-4 py-3">
                  {o.orderDate ? new Date(o.orderDate).toLocaleString('vi-VN') : '-'}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="inline-flex rounded-xl bg-pink-500 px-3 py-1.5 text-white hover:bg-pink-600"
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
