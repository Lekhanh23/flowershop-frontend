import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react';

const FOOTER_SHOP_LINKS = [
  { href: "/bouquets", label: "All Bouquets" },
  { href: "/signature", label: "Signature Bouquets" },
  { href: "/preserved", label: "Preserved Roses" },
  { href: "/roses", label: "Roses" },
  { href: "/gifts", label: "Flowers and Gifts" },
];

const FOOTER_ABOUT_LINKS = [
  { href: "/admin/users/customers/about%20us", label: "About Us" },
  { href: "/admin/users/customers/meet%20our%20team", label: "Our Team" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
];

const FOOTER_SAME_DAY_DELIVERY = [
  "Cau Giay", "Ba Dinh", 
  "Dong Da", "Tay Ho", 
  "Thanh Xuan", "Nam Tu Liem", 
  "Bac Tu Liem", "Ha Dong",
];

const FOOTER_NEXT_DAY_DELIVERY = [
  "Hoai Duc", "Hai Duong", 
  "Son Tay", "Ha Nam", 
  "Dan Phuong", "Ninh Binh", 
  "Chuong My", "Hung Yen", 
  "Thach That", "Soc Son",
];

export const Footer = () => {
  return (
    <footer className="bg-[#F5E0E0] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-8">
          <div className="w-full lg:w-1/5">
            <div className="w-36 h-36 relative">
              <Image src="/images/logo-blossom.png" alt="Blossom" fill className="object-contain" />
            </div>
          </div>

          <div className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_SHOP_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-pink-700 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_ABOUT_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-pink-700 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Same-day Delivery</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_SAME_DAY_DELIVERY.map((link) => (
                  <li key={link}><Link href={`/delivery/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-pink-700">{link}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Next-day Delivery</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {FOOTER_NEXT_DAY_DELIVERY.map((link) => (
                  <li key={link}><Link href={`/delivery/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-pink-700">{link}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-1/6 flex justify-end items-start">
            <div className="flex space-x-4 items-center text-gray-800">
              <Instagram className="w-6 h-6" />
              <Facebook className="w-6 h-6" />
              <Twitter className="w-6 h-6" />
              <Youtube className="w-6 h-6" />
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-pink-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-xs text-gray-700">
            <div className="hidden md:flex space-x-6">
              <Link href="/sitemap" className="hover:text-pink-700">Sitemap</Link>
              <Link href="/accessibility" className="hover:text-pink-700">Accessibility Statement</Link>
              <Link href="/terms" className="hover:text-pink-700">Term & Condition</Link>
              <Link href="/privacy" className="hover:text-pink-700">Privacy Policy</Link>
            </div>
            <div className="text-center text-xs text-gray-600">© {new Date().getFullYear()} Blossom Flower Shop</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
