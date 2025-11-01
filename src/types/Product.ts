// src/types/Product.ts
export interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    stock: number;
    status: 'in_stock' | 'out_of_stock';
    created_at: string;
  }