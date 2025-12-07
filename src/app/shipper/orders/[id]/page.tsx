// src/app/shipper/orders/[id]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderDetail = {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  notes?: string;
  items: Array<{name:string, qty:number}>;
  status: string;
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/shipper/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          // sample fallback
          setOrder({
            id: Number(id),
            order_code: `ORD-${id}`,
            customer_name: "Nguyễn Văn A",
            customer_phone: "090xxxxxxx",
            address: "123 Example Street, District 1",
            notes: "Leave at gate if nobody home",
            items: [{name: "Red Roses Bouquet", qty: 1}],
            status: "Ready to Pick up",
          });
        }
      } catch (e) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function updateStatus(nextStatus: string, proofFile?: File | null) {
    if (!order) return;
    // For Delivered, require proofFile
    if (nextStatus === "Delivered" && !proofFile) {
      // trigger file input
      fileRef.current?.click();
      return;
    }

    const body = new FormData();
    body.append("status", nextStatus);
    if (proofFile) body.append("proof", proofFile);

    setUploading(true);
    try {
      const res = await fetch(`/api/shipper/orders/${order.id}/status`, {
        method: "POST",
        body,
      });
      if (res.ok) {
        // refresh or update local state
        setOrder((o) => o ? {...o, status: nextStatus} : o);
        if (nextStatus === "Delivered") {
          // after delivered redirect to history or assigned list
          router.push("/shipper/assigned");
        }
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setUploading(false);
    }
  }

  function onProofSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    updateStatus("Delivered", f);
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <header className="mb-4">
        <Link href="/shipper/assigned" className="text-sm text-pink-600">← Back</Link>
        <h2 className="text-xl font-semibold mt-2">{order.order_code}</h2>
        <div className="text-sm text-gray-500">{order.status}</div>
      </header>

      <section className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="font-semibold">Customer</h3>
        <div className="mt-2">
          <div className="text-sm">{order.customer_name} • <a href={`tel:${order.customer_phone}`} className="text-pink-600">{order.customer_phone}</a></div>
          <div className="text-sm text-gray-600 mt-1">{order.address}</div>
          {order.notes && <div className="text-sm text-gray-600 mt-1">Notes: {order.notes}</div>}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="font-semibold">Items</h3>
        <ul className="mt-2 space-y-2">
          {order.items.map((it, idx) => (
            <li key={idx} className="text-sm">{it.qty} × {it.name}</li>
          ))}
        </ul>
      </section>

      <section className="flex gap-3">
        {order.status !== "Picked Up" && (
          <button onClick={() => updateStatus("Picked Up")} className="flex-1 bg-white border rounded-md py-2 font-semibold">Picked Up</button>
        )}
        {order.status !== "Out for Delivery" && (
          <button onClick={() => updateStatus("Out for Delivery")} className="flex-1 bg-yellow-500 text-white rounded-md py-2 font-semibold">Out for Delivery</button>
        )}
        <button onClick={() => fileRef.current?.click()} className="flex-1 bg-green-600 text-white rounded-md py-2 font-semibold">Delivered (Take Photo)</button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onProofSelected} className="hidden" />
      </section>

      <section className="mt-4">
        <button onClick={() => updateStatus("Delivery Failed")} className="w-full bg-red-50 text-red-700 border border-red-100 rounded-md py-2">Delivery Failed / Request Reassignment</button>
      </section>
    </main>
  );
}