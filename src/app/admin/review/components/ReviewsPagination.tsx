'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function ReviewsPagination({ totalPages }: { totalPages: number }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-4">
            {pages.map(page => (
                <a
                    key={page}
                    href={createPageURL(page)}
                    className={`px-4 py-2 mx-1 border rounded ${
                        page === currentPage ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 hover:bg-pink-50'
                    }`}
                >
                    {page}
                </a>
            ))}
        </div>
    );
}