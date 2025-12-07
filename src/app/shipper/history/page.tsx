// src/app/shipper/history/page.tsx
"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  id: number;
  order_code: string;
  date: string;
  status: string;
  proof_url?: string;
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [range, setRange] = useState("30"); // 7,30,90 days
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/shipper/history?days=${range}`);
        if (res.ok) {
          setItems(await res.json());
        } else {
          // sample
          setItems([
            {id:1, order_code:"ORD-100", date:"2025-12-01", status:"Delivered", proof_url:"/images/sample-proof.jpg"},
            {id:2, order_code:"ORD-90", date:"2025-11-25", status:"Delivery Failed"},
          ]);
        }
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [range]);

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Delivery History</h2>
        <div className="text-sm text-gray-500">Filter by period</div>
      </header>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setRange("7")} className={`px-3 py-1 rounded ${range==="7" ? "bg-pink-500 text-white" : "bg-white border"}`}>7 days</button>
        <button onClick={() => setRange("30")} className={`px-3 py-1 rounded ${range==="30" ? "bg-pink-500 text-white" : "bg-white border"}`}>30 days</button>
        <button onClick={() => setRange("90")} className={`px-3 py-1 rounded ${range==="90" ? "bg-pink-500 text-white" : "bg-white border"}`}>90 days</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.id} className="bg-white rounded shadow p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{it.order_code}</div>
                <div className="text-sm text-gray-500">{it.date} • {it.status}</div>
              </div>
              {it.proof_url ? (
                <img src={it.proof_url} alt="proof" className="w-20 h-20 object-cover rounded" />
              ) : null}
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-gray-500">No history found</div>}
        </div>
      )}
    </main>
  );
}