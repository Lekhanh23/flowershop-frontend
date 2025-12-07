// src/app/shipper/page.tsx
// Dashboard shipper - pink/white theme, mobile-first card layout
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust the import based on your context path

export default function ShipperDashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ pending: 0, deliveredToday: 0, incomeToday: 0 });
  const [notifications, setNotifications] = useState<Array<{ id: number; text: string; time: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/shipper/dashboard");
        if (res.ok) {
          const data = await res.json();
          setSummary({
            pending: data.pending ?? 0,
            deliveredToday: data.deliveredToday ?? 0,
            incomeToday: data.incomeToday ?? 0,
          });
          setNotifications(data.notifications ?? []);
        } else {
          setSummary({ pending: 2, deliveredToday: 4, incomeToday: 0 });
          setNotifications([{ id: 1, text: "Assigned order ORD-123", time: "2m" }]);
        }
      } catch (e) {
        setSummary({ pending: 0, deliveredToday: 0, incomeToday: 0 });
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleAccept = () => {
    // Logic to accept the order
    alert("Order accepted!");
  };

  const handleDecline = () => {
    // Logic to decline the order
    alert("Order declined.");
  };

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-full">
      <div className="max-w-lg mx-auto px-6 py-8 pb-12 shadow-lg rounded-lg bg-white">
        {/* Welcome + Status badge (compact) */}
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
          </div>
        </section>

        <div className="mb-6 border-t border-pink-200" />

        {/* Stats cards (3-column grid) */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-pink-100 p-4 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <h3 className="text-lg font-semibold text-pink-600">Pending</h3>
              <p className="text-3xl font-bold">{summary.pending}</p>
            </div>
            <div className="bg-pink-100 p-4 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <h3 className="text-lg font-semibold text-pink-600">Delivered Today</h3>
              <p className="text-3xl font-bold">{summary.deliveredToday}</p>
            </div>
            <div className="bg-pink-100 p-4 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <h3 className="text-lg font-semibold text-pink-600">Income Today</h3>
              <p className="text-3xl font-bold">${summary.incomeToday}</p>
            </div>
          </div>
        </section>

        <div className="mb-6 border-t border-pink-200" />

        {/* Quick Actions */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Assigned Orders</h3>
            <div className="flex justify-between">
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition-colors w-full mr-2"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="bg-red-500 text-white p-3 rounded-lg shadow-md hover:bg-red-600 transition-colors w-full"
              >
                Decline
              </button>
            </div>
          </div>
        </section>

        <div className="mb-6 border-t border-pink-200" />

        {/* Notifications */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center">No notifications</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li key={notification.id} className="bg-white p-3 rounded-lg shadow-md">
                  <p className="text-gray-700">{notification.text}</p>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mb-6 border-t border-pink-200" />

        {/* Delivery Flow */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Flow</h3>
          {/* Add your delivery flow content here */}
        </section>

        <div className="h-4" />
      </div>
    </main>
  );
}