'use client';

import { Review } from '../lib/definitions';
import { deleteReview } from '../action'; // Import Server Action
import { useTransition } from 'react';

// Giả định một component RatingStar đơn giản
const RatingStar = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                </span>
            ))}
        </div>
    );
};

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
    const [isPending, startTransition] = useTransition();

const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
        startTransition(async () => {
            const result = await deleteReview(id);
            if (result.success) {
                alert('Review deleted!');
            } else {
                alert(`Error: ${result.message}`);
            }
        });
    }
};
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-pink-500 text-white">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">User</th>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Rating</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Comments</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                        <tr key={review.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{review.id}</td>
                            <td className="px-4 py-2">
                                <div>{review.user_full_name}</div>
                                <div className="text-sm text-gray-500">{review.user_email}</div>
                            </td>
                            <td className="px-4 py-2">{review.product_name}</td>
                            <td className="px-4 py-2">
                                <RatingStar rating={review.rating} />
                            </td>
                            <td className="px-4 py-2">{review.created_at.toString().split(' ')[0]}</td>
                            <td className="px-4 py-2 max-w-xs truncate">{review.comment}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    disabled={isPending}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                    {isPending ? 'Deleting...' : '🗑️'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}