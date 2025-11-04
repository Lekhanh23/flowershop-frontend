import { Suspense } from 'react';
import { fetchFilteredReviews } from './lib/data';
import ReviewsTable from './components/ReviewsTable';
import ReviewsFilter from './components/ReviewsFilter';
import ReviewsPagination from './components/ReviewsPagination';
export const dynamic = 'force-dynamic';


// Định nghĩa props nhận từ URL search params
interface ReviewsPageProps {
    searchParams: {
        page?: string;
        userNameOrEmail?: string;
        productName?: string;
        date?: string;
        rating?: string;
    };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
    const currentPage = Number(searchParams.page) || 1;

    // Lấy dữ liệu từ Server
    const { reviews, totalPages } = await fetchFilteredReviews(searchParams, currentPage);

    // Dữ liệu tổng quan
    const totalReviews = reviews.length > 0 ? reviews.length : 0; // Thay thế bằng tổng số review thực tế

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-pink-600 mb-2">Review Management</h1>
            <div className="mb-4">
                <p className="text-lg">Total reviews: {totalReviews}</p>
            </div>
            
            {/* Thanh Filter/Tìm kiếm */}
            <ReviewsFilter />

            {/* Nút Delete (cho chức năng xóa nhiều, nếu cần) */}
            <button className="px-4 py-2 mb-4 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
            </button>
            
            {/* Bảng Reviews */}
            <Suspense fallback={<div>Loading reviews...</div>}>
                <ReviewsTable reviews={reviews} />
            </Suspense>

            {/* Phân trang */}
            <div className="mt-4">
                <ReviewsPagination totalPages={totalPages} />
            </div>
        </div>
    );
}