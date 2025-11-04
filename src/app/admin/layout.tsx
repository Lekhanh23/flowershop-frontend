// src/app/admin/layout.tsx
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AdminLayout({ // <-- Đây là AdminLayout
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
          <Header />
          <main className="max-w-7xl mx-auto p-8 w-full">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return null;
}