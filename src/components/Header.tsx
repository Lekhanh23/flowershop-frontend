"use client";

import { useAuth } from '@/context/AuthContext';
import { RxMagnifyingGlass, RxAvatar } from 'react-icons/rx';
import { FaBell } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Thanh Tìm kiếm (Giống TailAdmin) */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <RxMagnifyingGlass className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search or type command..."
            className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>

        {/* Thông tin User và Logout */}
        <div className="flex items-center space-x-4">
          <FaBell className="h-5 w-5 text-gray-600 cursor-pointer" />
          
          <div className="flex items-center space-x-2">
            <RxAvatar className="h-8 w-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              Hi, {user?.full_name.split(' ')[0]}
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}