"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RxDashboard,
  RxArchive,
  RxBox,
  RxStar,
  RxPerson,
} from 'react-icons/rx';

// Định nghĩa các link điều hướng
const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: RxDashboard },
  { name: 'Manage Orders', href: '/admin/orders', icon: RxArchive },
  { name: 'Manage Products', href: '/admin/products', icon: RxBox },
  { name: 'Manage Reviews', href: '/admin/reviews', icon: RxStar },
  { name: 'Manage Users', href: '/admin/users', icon: RxPerson },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-xl">
      <div className="flex items-center justify-center p-6 border-b">
        {/* Bạn có thể thay 'Flowershop' bằng logo của mình */}
        <h1 className="text-2xl font-bold text-pink-600">Flowershop</h1>
      </div>

      <nav className="mt-6">
        <p className="px-6 py-2 text-xs uppercase text-gray-500">Menu</p>
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon; // Lấy component Icon

            return (
              <li key={link.name} className="px-4 py-1">
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium ${
                    isActive
                      ? 'bg-pink-100 text-pink-600' // Màu active
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Màu mặc định
                  } transition-colors`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}