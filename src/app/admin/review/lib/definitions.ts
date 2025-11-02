// dinh nghia kieu du lieu cho 1 danh gia
export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number; // 1 to 5
    comment: string | null;
    created_at: Date;
    // du lieu JOIN tu bang users & products
    user_full_name: string;
    user_email: string;
    product_name: string;
}

// DInh nghia kieu du lieu cho cac tham so Filter va
//  Pagination
export interface ReviewsSearchParams {
    page?: string;
    limit?: string;
    userNameOrEmail?: string;
    productName?: string;
    date?: string;
    rating?: string;
}