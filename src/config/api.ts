// API configuration and base setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    sendPhoneOtp: '/auth/send-phone-otp',
    verifyPhoneOtp: '/auth/verify-phone-otp',
    googleAuth: '/auth/google',
  },
  users: {
    profile: '/users/profile',
    addresses: '/users/addresses',
    preferences: '/users/preferences',
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    categories: '/products/meta/categories',
    brands: '/products/meta/brands',
    reviews: (id: string) => `/products/${id}/reviews`,
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
    return: (id: string) => `/orders/${id}/return`,
    exchange: (id: string) => `/orders/${id}/exchange`,
    track: (id: string) => `/orders/${id}/track`,
    reorder: (id: string) => `/orders/${id}/reorder`,
  },
  payments: {
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
    failure: '/payments/failure',
    history: '/payments/history',
  },
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Create headers with auth token
export const createAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};