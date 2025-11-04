'use client';

import { useState, useTransition } from 'react';

type OrderStatus = 'pending' | 'shipped' | 'delivered';

export default function OrderStatusSelect({
  orderId,
  defaultStatus,
}: {
  orderId: number | string;
  defaultStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(defaultStatus);
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        setStatus(next);
        startTransition(async () => {
          const res = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: next }),
          });
          if (!res.ok) alert('Cập nhật trạng thái thất bại');
        });
      }}
      className="rounded px-2 py-1 border"
      aria-label={`Status for order ${orderId}`}
      disabled={isPending}
    >
      <option value="pending">pending</option>
      <option value="shipped">shipped</option>
      <option value="delivered">delivered</option>
    </select>
  );
}
