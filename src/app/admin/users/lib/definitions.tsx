export interface User {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    role: 'admin' | 'customer';
}