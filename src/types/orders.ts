// src/types/order.ts
export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;         // VND
  status: OrderStatus;
  createdAt: string;     // ISO
}
