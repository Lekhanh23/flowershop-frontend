'use client';

import Link from 'next/link';
import { ShoppingCart, User, Phone, ChevronDown, Bell, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const HeaderCustomer = () => {
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const collectionDropdownRef = useRef<HTMLDivElement>(null);
  const storyDropdownRef = useRef<HTMLDivElement>(null);
  
  const collectionItems = [
    { label: 'All Collections', href: '/collection' },
    { label: 'Birthday', href: '/collection/birthday' },
    { label: 'Anniversary', href: '/collection/anniversary' },
    { label: 'Congratulations', href: '/collection/congratulations' },
    { label: "Parent's Day", href: '/collection/parents-day' },
    { label: "Teacher's Day", href: '/collection/teachers-day' },
    { label: "International's Day", href: '/collection/internationals-day' },
  ];

  const storyItems = [
    { label: 'About Us', href: 'src/app/customers/about_us' },
    { label: 'Our Team', href: 'src/app/customers/meet_our_team' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(event.target as Node)) {
        setIsCollectionOpen(false);
      }
      if (storyDropdownRef.current && !storyDropdownRef.current.contains(event.target as Node)) {
        setIsStoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <nav className="hidden lg:flex space-x-8">
          <Link href="/bouquet" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
            BOUQUET
          </Link>
          
          <div className="relative group" ref={collectionDropdownRef}
               onMouseEnter={() => setIsCollectionOpen(true)}
               onMouseLeave={() => setIsCollectionOpen(false)}>
            <button
              onClick={() => setIsCollectionOpen(!isCollectionOpen)}
              className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <span>COLLECTION</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className={`absolute left-0 mt-0 w-56 bg-white border border-gray-200 shadow-lg transition-all duration-300 origin-top ${
              isCollectionOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
            }`}>
              {collectionItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors ${
                    index === 0 ? 'border-b border-gray-200 font-semibold' : ''
                  }`}
                  onClick={() => setIsCollectionOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative group" ref={storyDropdownRef}
               onMouseEnter={() => setIsStoryOpen(true)}
               onMouseLeave={() => setIsStoryOpen(false)}>
            <button
              onClick={() => setIsStoryOpen(!isStoryOpen)}
              className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <span>OUR STORY</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className={`absolute left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg transition-all duration-300 origin-top ${
              isStoryOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
            }`}>
              {storyItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  onClick={() => setIsStoryOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-1 lg:flex-none text-center">
          <Link href="/" className="text-2xl font-serif tracking-widest text-pink-700 font-bold">
            Shop
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-pink-600" />
            <span className="hidden md:inline">Call Us:</span>
            <span className="font-semibold">1900 1234</span>
          </div>
          
          <button className="relative p-1 text-gray-700 hover:text-pink-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-pink-600 cursor-pointer transition-colors" />
          
          <Link href="/sign-in" className="p-1 text-gray-700 hover:text-pink-600 transition-colors">
            <User className="w-5 h-5" />
          </Link>
          
          <button className="p-1 text-gray-700 hover:text-pink-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
