// src/app/shipper/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Profile = {
  full_name?: string;
  email?: string;
  phone?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  national_id?: string;
  bank_account?: string;
};

export default function ShipperProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/shipper/profile");
        if (res.ok) setProfile(await res.json());
      } catch {
        setProfile({
          full_name: "Jane Doe",
          email: "shipper@example.com",
          phone: "0912345678",
          vehicle_type: "Motorbike",
          vehicle_plate: "29H1-123.45",
          national_id: "0123456789",
          bank_account: "Bank of Example — 0123456 — Jane Doe",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-pink-50 p-5">
        <div className="max-w-xl mx-auto animate-pulse space-y-4">
          <div className="h-20 bg-white rounded-xl" />
          <div className="h-44 bg-white rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 p-5">
      <div className="max-w-xl mx-auto">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h1>
        <p className="text-sm text-gray-500 mb-4">Shipper account overview</p>

        {/* TOP CARD — NO AVATAR */}
        <section className="bg-white rounded-2xl shadow p-5 mb-5">

          <h2 className="text-lg font-semibold text-gray-800">{profile?.full_name}</h2>
          <p className="text-sm text-gray-600 mt-1">{profile?.email}</p>

          {/* Buttons */}
          <div className="mt-5 flex gap-3">
            <Link
              href="/shipper/profile/edit"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-pink-100 text-pink-700 text-sm font-medium hover:bg-pink-200 transition"
            >
              Edit profile
            </Link>

            <Link
              href="/shipper/profile/change-password"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition"
            >
              Change password
            </Link>
          </div>
        </section>

        {/* DETAILS CARD */}
        <section className="bg-white rounded-2xl shadow p-5 mb-8">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Account details</h3>

          <div className="space-y-4">
            <Detail label="Full name" value={profile?.full_name} />
            <Detail label="Email" value={profile?.email} />
            <Detail label="Phone" value={profile?.phone} />

            {/* Vehicle info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-pink-50 rounded-xl">
                <div className="text-xs text-gray-500">Vehicle</div>
                <div className="text-sm font-medium text-gray-800">{profile?.vehicle_type}</div>
              </div>

              <div className="p-3 bg-pink-50 rounded-xl">
                <div className="text-xs text-gray-500">Plate</div>
                <div className="text-sm font-medium text-gray-800">{profile?.vehicle_plate}</div>
              </div>
            </div>

            <Detail label="National ID" value={profile?.national_id} />
            <Detail label="Bank account" value={profile?.bank_account} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value ?? "—"}</div>
    </div>
  );
}
