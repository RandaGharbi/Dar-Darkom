import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types pour les données
export interface Product {
  _id: string;
  id: number;
  name: string;
  title?: string;
  subtitle?: string;
  description?: string;
  product_url: string;
  image_url?: string;
  image?: string;
  price: number;
  customerRating?: number;
  numberOfReviews?: number;
  productCollection?: string;
  productBrand?: string;
  typeOfCare?: string;
  category: string;
  arrivals?: string;
  productType: 'ingredient' | 'bodyCare' | 'hairCare' | 'skinCare' | 'product';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  username?: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  products: Array<{
    name: string;
    qty: number;
    image: string;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'active' | 'completed' | 'cancelled';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  isOrdered: boolean;
}

export interface Discount {
  _id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
  applicableTo: 'all' | 'specific_products' | 'specific_categories';
  description?: string;
  discountCollection?: string;
  createdAt: string;
  updatedAt: string;
}

// API functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
  signup: (name: string, email: string, password: string) =>
    api.post('/signup', { name, email, password }),
  getMe: () => api.get('/me'),
};

export const productsAPI = {
  getAll: () => api.get<Product[]>('/products'),
  getByType: (type: string) => api.get<Product[]>(`/products/type/${type}`),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  import: () => api.post('/products/import'),
  deleteAll: () => api.delete('/products'),
};

export const ordersAPI = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  getByUser: (userId: string) => api.get<Order[]>(`/orders/user/${userId}`),
  getActive: (userId: string) => api.get<Order[]>(`/orders/active/${userId}`),
  getHistory: (userId: string) => api.get<Order[]>(`/orders/history/${userId}`),
  updateStatus: (id: string, status: Order['status']) => 
    api.put<Order>(`/orders/${id}/status`, { status }),
};

export const usersAPI = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const discountsAPI = {
  getAll: () => api.get<Discount[]>('/discounts'),
  getByCollection: (collection: string) => api.get<Discount[]>(`/discounts/collection/${collection}`),
  getByCode: (code: string) => api.get<Discount>(`/discounts/code/${code}`),
  create: (data: Partial<Discount>) => api.post<Discount>('/discounts', data),
  update: (id: string, data: Partial<Discount>) => api.put<Discount>(`/discounts/${id}`, data),
  delete: (id: string) => api.delete(`/discounts/${id}`),
  useCode: (code: string) => api.post(`/discounts/use/${code}`),
}; 