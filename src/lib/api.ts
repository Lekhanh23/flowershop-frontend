import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Thêm Interceptor để tự động gắn Token vào mọi request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage ngay lúc gửi request
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;