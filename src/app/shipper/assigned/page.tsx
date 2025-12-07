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
        if (res.ok) setOrders(await res.json());
        else setOrders([]);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="max-w-3xl mx-auto">
      <header className="mb-4">
        <h1 className="text-xl font-semibold">Assigned Deliveries</h1>
        <p className="text-sm text-gray-500">Tap an order to view details</p>
      </header>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {orders.length === 0 && <div className="text-sm text-gray-500">No assigned orders.</div>}
          {orders.map(o => (
            <article key={o.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-400">Order</div>
                  <div className="font-semibold">{o.order_code}</div>
                  <div className="text-sm text-gray-600 mt-1">{o.address}</div>
                  <div className="text-xs text-gray-400 mt-1">ETA: {o.eta ?? "-"}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <a href={`tel:${o.customer_phone}`} className="text-sm text-gray-600 border px-3 py-1 rounded">Call</a>
                  <Link href={`/shipper/orders/${o.id}`} className="bg-pink-500 text-white px-3 py-1 rounded text-sm">Manage</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}