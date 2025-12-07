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
        setProfile({ vehicle_type: "Motorbike", vehicle_plate: "29H1-123.45", national_id: "0123456789", bank_account: "Vietcombank - 0123456 - Nguyen A" });
        setNotifications([{id:1, text:"Order #123 assigned", time:"1h"}]);
      }
    }
    load();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6 bg-gray-50">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-500">Your account information</p>
      </header>

      <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Vehicle</div>
            <div className="text-xl font-semibold text-gray-800">{profile?.vehicle_type ?? "-"}</div>
            <div className="text-xs text-gray-400">Plate: {profile?.vehicle_plate ?? "-"}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Verified</div>
            <div className={`mt-1 text-sm font-semibold ${profile?.is_verified ? "text-green-600" : "text-yellow-600"}`}>
              {profile?.is_verified ? "Yes" : "Pending"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <div className="text-sm text-gray-600">National ID: <span className="text-gray-800 ml-1">{profile?.national_id ?? "-"}</span></div>
          <div className="text-sm text-gray-600">Bank account: <span className="text-gray-800 ml-1">{profile?.bank_account ?? "-"}</span></div>
        </div>

        <div className="mt-4">
          <a href="/shipper/profile/edit" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit profile</a>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-semibold mb-4 text-lg">Notifications</h2>
        <ul className="space-y-2">
          {notifications.map(n => (
            <li key={n.id} className="text-sm flex justify-between items-center">
              <span>{n.text}</span>
              <span className="text-xs text-gray-400">{n.time}</span>
            </li>
          ))}
          {notifications.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
        </ul>
      </section>
    </main>
  );
}