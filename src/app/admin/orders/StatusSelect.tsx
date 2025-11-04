'use client';

import { useOptimistic, useTransition } from 'react';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

function StatusBadge({ status }: { status: OrderStatus }) {
  const cls: Record<OrderStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-gray-100 text-gray-700',
  };
  return <span className={`px-2 py-1 rounded-lg text-xs ${cls[status]}`}>{status}</span>;
}

export default function StatusSelect({
  id,
  initialStatus,
}: {
  id: number;
  initialStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimistic] = useOptimistic<OrderStatus>(initialStatus);

  async function updateStatus(next: OrderStatus) {
    setOptimistic(next);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('Update failed');
    } catch {
      setOptimistic(initialStatus);
      alert('Không cập nhật được trạng thái.');
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={initialStatus}
        disabled={isPending}
        onChange={(e) => startTransition(() => updateStatus(e.target.value as OrderStatus))}
        className="rounded-lg border px-2 py-1"
      >
        {(['Pending', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <StatusBadge status={optimisticStatus} />
    </div>
  );
}
