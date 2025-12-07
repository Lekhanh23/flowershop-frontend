// src/app/shipper/profile/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function ShipperProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, nRes] = await Promise.all([
          fetch("/api/shipper/profile"),
          fetch("/api/shipper/notifications"),
        ]);
        if (pRes.ok) setProfile(await pRes.json());
        if (nRes.ok) setNotifications(await nRes.json());
      } catch (e) {
        // fallback
        setProfile({ vehicle_type: "Motorbike", vehicle_plate: "29H1-123.45", national_id: "0123456789", bank_account: "Vietcombank - 0123456 - Nguyen A" });
        setNotifications([{id:1, text:"Order #123 assigned", time:"1h"}]);
      }
    }
    load();
  }, []);

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Profile</h2>
      </header>

      <section className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="font-semibold mb-2">Personal & Vehicle</h3>
        <div className="text-sm text-gray-700">Vehicle: {profile?.vehicle_type || "-"} • Plate: {profile?.vehicle_plate || "-"}</div>
        <div className="text-sm text-gray-700 mt-1">National ID: {profile?.national_id || "-"}</div>
        <div className="text-sm text-gray-700 mt-1">Bank Account: {profile?.bank_account || "-"}</div>
        <div className="mt-3">
          <a href="/shipper/profile/edit" className="text-pink-600 text-sm">Edit profile</a>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Notifications</h3>
        <ul className="space-y-2 text-sm">
          {notifications.map(n => (
            <li key={n.id} className="text-gray-700 flex justify-between">
              <span>{n.text}</span>
              <span className="text-xs text-gray-400">{n.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}