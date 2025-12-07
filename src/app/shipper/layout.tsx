import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipper | Flower Shop',
    description: 'Shipper management dashboard',
};

export default function ShipperLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 md:bg-white">
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 bg-white shadow-sm md:shadow-none">
                <div className="px-4 py-3 md:px-6 md:py-4">
                    <h1 className="text-lg font-semibold text-gray-900">Shipper</h1>
                </div>
            </header>

            {/* Mobile Container */}
            <main className="mx-auto max-w-md px-4 py-4 md:max-w-full md:p-6">
                {children}
            </main>
        </div>
    );
}