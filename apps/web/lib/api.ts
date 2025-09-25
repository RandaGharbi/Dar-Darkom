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
  console.log('🌐 API REQUEST:', {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    hasToken: !!token,
    timestamp: new Date().toISOString()
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ API ERROR:', {
      url: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
    
    // Afficher le message d'erreur spécifique du serveur
    if (error.response?.data?.message) {
      console.error('📝 Message d\'erreur du serveur:', error.response.data.message);
    }
    
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
  quantity?: number;
  status?: string;
  productType: 'ingredient' | 'bodyCare' | 'hairCare' | 'skinCare' | 'product';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role?: 'admin' | 'user' | 'EMPLOYE' | 'LIVREUR';
  createdAt: string;
  updatedAt: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  username?: string;
  isEmailVerified?: boolean;
  isOnline?: boolean;
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
  status: 'active' | 'completed' | 'cancelled' | 'confirmed' | 'rejected' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'PENDING' | 'READY' | 'CANCELLED';
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
  livreurId?: string | User;
  qrCode?: string;
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
  logout: () => api.post('/logout'),
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
  getPending: () => api.get<Order[]>('/orders/pending'),
  updateStatus: (id: string, status: Order['status']) => 
    api.put<Order>(`/orders/${id}/status`, { status }),
  acceptOrder: (id: string) => api.put<Order>(`/orders/${id}/accept`),
  rejectOrder: (id: string, reason?: string) => api.put<Order>(`/orders/${id}/reject`, { reason }),
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

// Interface pour les favoris
export interface Favorite {
  _id: string;
  userId: string;
  productId: string;
  title: string;
  subtitle?: string;
  price: number;
  image_url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export const favoritesAPI = {
  getAll: () => api.get<{ favorites: Favorite[], count: number }>('/favorites'),
  getByUser: (userId: string) => api.get<{ favorites: Favorite[], count: number }>(`/favorites/user/${userId}`),
  add: (data: { productId: string; title: string; subtitle?: string; price: number; image_url: string; category: string }) => 
    api.post<Favorite>('/favorites/add', data),
  remove: (productId: string) => api.delete(`/favorites/remove/${productId}`),
  toggle: (data: { productId: string; title: string; subtitle?: string; price: number; image_url: string; category: string }) => 
    api.post<{ message: string; isFavorite: boolean; favorite?: Favorite }>('/favorites/toggle', data),
  check: (productId: string) => api.get<{ isFavorite: boolean }>(`/favorites/check/${productId}`),
  clear: () => api.delete('/favorites/clear'),
};

// Interface pour les cartes de paiement
export interface PaymentCard {
  _id: string;
  userId: string;
  cardNumber: string;
  expiryDate: string;
  nameOnCard: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export const cardsAPI = {
  getByUser: (userId: string) => api.get<PaymentCard[]>(`/api/card/user/${userId}`),
  add: (data: {
    userId: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
    billingAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => api.post<PaymentCard>('/api/card/add', data),
  update: (cardId: string, data: Partial<PaymentCard>) => api.put<PaymentCard>(`/api/card/${cardId}`, data),
  delete: (cardId: string) => api.delete(`/api/card/${cardId}`),
};

export interface Activity {
  _id: string;
  userId: string;
  type: 'order' | 'favorite' | 'payment' | 'profile' | 'login' | 'logout';
  title: string;
  description: string;
  details?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const activitiesAPI = {
  getByUser: (userId: string) => api.get<{ activities: Activity[], count: number }>(`/activities/user/${userId}`),
  create: (data: {
    userId: string;
    type: 'order' | 'favorite' | 'payment' | 'profile' | 'login' | 'logout';
    title: string;
    description: string;
    details?: string;
    metadata?: Record<string, unknown>;
  }) => api.post<Activity>('/activities', data),
};

// API pour les employés
export const employeeAPI = {
  // Authentification employé
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
  
  // Inscription employé
  register: (data: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    confirmPassword: string;
  }) =>
    api.post<{ success: boolean; message: string; data: { user: User; token: string } }>('/employee/register', data),
  
  // Confirmer l'email employé
  confirmEmail: (token: string) =>
    api.get<{ success: boolean; message: string; data: any }>(`/employee/confirm-email?token=${token}`),
  
  // Obtenir les commandes (PENDING, READY)
  getOrders: (status?: string[]) =>
    api.get<{ success: boolean; data: Order[]; count: number }>('/employee/orders', {
      params: status ? { status } : {}
    }),
  
  // Obtenir les détails d'une commande
  getOrderDetails: (orderId: string) =>
    api.get<{ success: boolean; data: Order }>(`/employee/orders/${orderId}`),
  
  // Accepter une commande
  acceptOrder: (orderId: string) =>
    api.put<{ success: boolean; message: string; data: any }>(`/employee/orders/${orderId}/accept`),
  
  // Rejeter une commande
  rejectOrder: (orderId: string, reason?: string) =>
    api.put<{ success: boolean; message: string; data: any }>(`/employee/orders/${orderId}/reject`, { reason }),
  
  // Assigner un livreur
  assignLivreur: (orderId: string, livreurId: string) =>
    api.put<{ success: boolean; message: string; data: any }>(`/employee/orders/${orderId}/assign-livreur`, { livreurId }),
  
  // Obtenir la liste des livreurs
  getLivreurs: () =>
    api.get<{ success: boolean; data: User[]; count: number }>('/employee/livreurs'),
};