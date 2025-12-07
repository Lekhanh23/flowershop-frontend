// src/app/shipper/orders/[id]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/shipper/orders/${id}`);
        if (res.ok) setOrder(await res.json());
      } catch (e) {
        // fallback sample
        setOrder({
          id,
          order_code: `ORD-${id}`,
          customer_name: "Nguyen Van A",
          customer_phone: "090xxx",
          address: "123 Example St",
          notes: "Leave at gate",
          items: [{name:"Red Roses", qty:1}],
          status: "Ready to Pick up",
        });
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  async function updateStatus(nextStatus: string, proof?: File) {
    if (!order) return;
    if (nextStatus === "Delivered" && !proof) {
      fileRef.current?.click();
      return;
    }

    const fd = new FormData();
    fd.append("status", nextStatus);
    if (proof) fd.append("proof", proof);

    setUploading(true);
    try {
      const res = await fetch(`/api/shipper/orders/${order.id}/status`, { method: "POST", body: fd });
      if (res.ok) {
        setOrder({...order, status: nextStatus});
        if (nextStatus === "Delivered") router.push("/shipper/assigned");
      } else {
        alert("Failed");
      }
    } catch (e) {
      alert("Network error");
    } finally { setUploading(false); }
  }

  function onProof(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) updateStatus("Delivered", f);
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (!order) return <div className="p-4">Order not found</div>;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <Link href="/shipper/assigned" className="text-sm text-pink-600">← Back</Link>
      <h1 className="text-xl font-semibold mt-3">{order.order_code}</h1>
      <div className="text-sm text-gray-500 mb-3">{order.status}</div>

      <section className="bg-white rounded-lg shadow p-4 mb-3">
        <div className="font-semibold">Customer</div>
        <div className="text-sm mt-1">{order.customer_name} • <a href={`tel:${order.customer_phone}`} className="text-pink-600">{order.customer_phone}</a></div>
        <div className="text-sm text-gray-600 mt-1">{order.address}</div>
        {order.notes && <div className="text-sm text-gray-600 mt-1">Notes: {order.notes}</div>}
      </section>

      <section className="bg-white rounded-lg shadow p-4 mb-3">
        <div className="font-semibold">Items</div>
        <ul className="mt-2 space-y-1">
          {order.items.map((it:any,i:number) => <li key={i} className="text-sm">{it.qty}× {it.name}</li>)}
        </ul>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button onClick={() => updateStatus("Picked Up")} className="py-2 rounded bg-white border text-sm">Picked Up</button>
        <button onClick={() => updateStatus("Out for Delivery")} className="py-2 rounded bg-yellow-400 text-white text-sm">Out for Delivery</button>
        <button onClick={() => fileRef.current?.click()} className="py-2 rounded bg-green-600 text-white text-sm">Delivered (Photo)</button>
      </section>

      <div className="mt-3">
        <button onClick={() => updateStatus("Delivery Failed")} className="w-full py-2 rounded border text-red-600">Delivery Failed / Request Reassignment</button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onProof} className="hidden" />
    </main>
  );
}