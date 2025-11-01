// src/types/User.ts
export interface User {
    id: number;
    email: string;
    full_name: string;
    role: 'admin' | 'customer';
  }