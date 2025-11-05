import { Suspense } from 'react';
import { fetchFilteredReviews } from './lib/data';
import ReviewsTable from './components/ReviewsTable';
import ReviewsFilter from './components/ReviewsFilter';
import ReviewsPagination from './components/ReviewsPagination';
import styles from './page.module.css';
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
        <div className={styles.container}>
            <h1 className={styles.title}>Review Management</h1>
            <div style={{ marginBottom: 16 }}>
                <p style={{ color: '#e91e63', fontWeight: 500 }}>Total reviews: {totalReviews}</p>
            </div>
            <div className={styles.filterRow}>
                <ReviewsFilter />
            </div>
            <button className={styles.deleteBtn} style={{ marginBottom: 16 }}>
                Delete
            </button>
            <Suspense fallback={<div>Loading reviews...</div>}>
                <ReviewsTable reviews={reviews} />
            </Suspense>
            <div style={{ marginTop: 16 }}>
                <ReviewsPagination totalPages={totalPages} />
            </div>
        </div>
    );
}