'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ReviewsSearchParams } from '../lib/definitions';
import { useState } from 'react';

export default function ReviewsFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [filters, setFilters] = useState<Omit<ReviewsSearchParams, 'page' | 'limit'>>({
        userNameOrEmail: searchParams.get('userNameOrEmail') || '',
        productName: searchParams.get('productName') || '',
        date: searchParams.get('date') || '',
        rating: searchParams.get('rating') || 'Rating',
    });

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams);
        // Reset về trang 1 khi lọc
        params.set('page', '1'); 

        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof typeof filters];
            if (value && value !== 'Rating' && value !== 'dd/mm/yyyy') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <input
                type="text"
                placeholder="User name or email"
                value={filters.userNameOrEmail}
                onChange={(e) => setFilters(p => ({ ...p, userNameOrEmail: e.target.value }))}
                className="p-2 border rounded"
            />
            <input
                type="text"
                placeholder="Product name"
                value={filters.productName}
                onChange={(e) => setFilters(p => ({ ...p, productName: e.target.value }))}
                className="p-2 border rounded"
            />
            <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={filters.date}
                onChange={(e) => setFilters(p => ({ ...p, date: e.target.value }))}
                className="p-2 border rounded w-32"
            />
            <select
                value={filters.rating}
                onChange={(e) => setFilters(p => ({ ...p, rating: e.target.value }))}
                className="p-2 border rounded"
            >
                <option value="Rating">Rating</option>
                <option value="5">★★★★★</option>
                <option value="4">★★★★☆</option>
                <option value="3">★★★☆☆</option>
                <option value="2">★★☆☆☆</option>
                <option value="1">★☆☆☆☆</option>
            </select>
            <button
                onClick={handleFilter}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
                Filter
            </button>
        </div>
    );
}