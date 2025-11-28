export const getImageUrl = (imagePath: string | null | undefined) => {
    if(!imagePath) {
        return "http://via.placeholder.com/48";
    }
    if(imagePath.startsWith("http")) {
        return imagePath;
    }
    const root = process.env.NEXT_PUBLIC_BACKEND_ROOT || "http://localhost:3000";
    const cleanPath = imagePath.replace(/^\/?uploads\//, "");
    return `${root}/uploads/${cleanPath}`;
};

export const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('vi-VN').format(Number(price)) + ' VND';
};

export const formatDate = (dateString: string) => {
    if(!dateString) {
        return '-';
    }
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};