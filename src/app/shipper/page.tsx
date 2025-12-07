// src/app/shipper/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ShipperDashboard() {
  const [available, setAvailable] = useState(true);
  const [summary, setSummary] = useState({ pending: 0, deliveredToday: 0, incomeToday: 0 });
  const [notifications, setNotifications] = useState<Array<{id:number, text:string, time:string}>>([]);

  useEffect(() => {
    // Load initial summary + notifications (replace endpoints)
    async function load() {
      try {
        const res = await fetch("/api/shipper/dashboard"); // implement backend
        if (res.ok) {
          const data = await res.json();
          setSummary({
            pending: data.pending || 0,
            deliveredToday: data.deliveredToday || 0,
            incomeToday: data.incomeToday || 0,
          });
          setNotifications(data.notifications || []);
          setAvailable(typeof data.available === "boolean" ? data.available : true);
        } else {
          // fallback sample
          setSummary({ pending: 2, deliveredToday: 5, incomeToday: 0 });
          setNotifications([{id:1, text:"New assigned order #123", time:"2m ago"}]);
        }
      } catch (e) {
        setSummary({ pending: 2, deliveredToday: 5, incomeToday: 0 });
        setNotifications([{id:1, text:"New assigned order #123", time:"2m ago"}]);
      }
    }
    load();
  }, []);

  async function toggleAvailable(next: boolean) {
    setAvailable(next);
    // send to backend
    try {
      await fetch("/api/shipper/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: next }),
      });
    } catch (e) {
      // ignore
    }
  }

  return (
    <main className="p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-gray-600">Overview of your delivery performance</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Assigned</div>
            <div className="mt-2 text-2xl font-bold">{summary.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Delivered Today</div>
            <div className="mt-2 text-2xl font-bold">{summary.deliveredToday}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Income Today</div>
            <div className="mt-2 text-2xl font-bold">{summary.incomeToday} VND</div>
          </div>
        </section>

        <section className="flex items-center justify-between bg-white rounded-lg shadow p-4 mb-6">
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div className="mt-1 font-medium">{available ? "Available" : "Busy / Unavailable"}</div>
          </div>
          <label className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Toggle</span>
            <button
              onClick={() => toggleAvailable(!available)}
              className={`w-14 h-8 rounded-full p-1 transition ${available ? "bg-pink-500" : "bg-gray-300"}`}
              aria-pressed={available}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white transform transition ${available ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </label>
        </section>

        <section className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Notifications</h3>
            <Link href="/shipper/assigned" className="text-pink-600 text-sm">View Assigned</Link>
          </div>
          {notifications.length === 0 ? (
            <div className="text-sm text-gray-500">No notifications</div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li key={n.id} className="text-sm text-gray-700 flex justify-between">
                  <span>{n.text}</span>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex gap-3">
          <Link href="/shipper/assigned" className="flex-1 bg-pink-500 text-white rounded-lg px-4 py-2 text-center font-semibold hover:bg-pink-600">
            Assigned Deliveries
          </Link>
          <Link href="/shipper/history" className="flex-1 bg-white border rounded-lg px-4 py-2 text-center font-semibold">
            Delivery History
          </Link>
        </section>
      </div>
    </main>
  );
}