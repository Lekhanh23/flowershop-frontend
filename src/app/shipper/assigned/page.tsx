// src/app/shipper/assigned/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderSummary = {
  id: number;
  order_code: string;
  address: string;
  eta?: string;
  status: string;
  customer_phone?: string;
  items_count?: number;
};

export default function AssignedPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/shipper/assigned");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          // sample
          setOrders([
            { id: 123, order_code: "ORD-123", address: "12 Lê Lợi, Hà Nội", eta: "15:30", status: "Ready to Pick up", customer_phone: "0123456789", items_count: 2 },
            { id: 124, order_code: "ORD-124", address: "45 Nguyễn Trãi, Hà Nội", eta: "16:10", status: "Ready to Pick up", customer_phone: "0987654321", items_count: 1 },
          ]);
        }
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="p-4 sm:p-6 max-w-3xl mx-auto">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Assigned Deliveries</h2>
        <p className="text-sm text-gray-500">Orders that have been assigned to you by Admin</p>
      </header>

      {loading ? <div>Loading...</div> : null}

      <div className="space-y-4">
        {orders.map((o) => (
          <article key={o.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm text-gray-500">Order</div>
              <div className="font-semibold">{o.order_code} • {o.items_count} items</div>
              <div className="text-sm text-gray-600 mt-1">{o.address}</div>
              <div className="text-xs text-gray-400 mt-1">ETA: {o.eta || "-"}</div>
            </div>

            <div className="flex items-center gap-2">
              <a href={`tel:${o.customer_phone}`} className="inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-md text-sm hover:bg-gray-50">
                Call Customer
              </a>
              <Link href={`/shipper/orders/${o.id}`} className="inline-flex items-center gap-2 bg-pink-500 text-white px-3 py-2 rounded-md text-sm hover:bg-pink-600">
                View / Manage
              </Link>
            </div>
          </article>
        ))}

        {orders.length === 0 && !loading && <div className="text-sm text-gray-500">No assigned orders.</div>}
      </div>
    </main>
  );
}