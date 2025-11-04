"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar'; // <-- Import Sidebar mới
import Header from '@/components/Header'; // <-- Import Header mới

export default function AdminLayout({
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
        {/* --- 1. Sidebar --- */}
        <Sidebar />

        {/* --- 2. Vùng Nội dung chính (Bên phải Sidebar) --- */}
        <div className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}> {/* 16rem = w-64 của Sidebar */}
          
          {/* Header (thanh tìm kiếm, logout) */}
          <Header />

          {/* Nội dung trang (Dashboard, Products...) */}
          <main className="max-w-7xl mx-auto p-8 w-full">
            {/* Phần nội dung trắng (giống ảnh cũ của bạn) 
              Chúng ta sẽ bọc children trong một div trắng
            */}
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