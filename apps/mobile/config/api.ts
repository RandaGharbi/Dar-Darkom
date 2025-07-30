import { config } from './env';

// Centralized API configuration
const API_CONFIG = {
  // Backend base URL - Uses environment configuration
  BASE_URL: config.API_BASE_URL,
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/login',
    REGISTER: '/api/signup',
    LOGOUT: '/api/logout',
    ME: '/api/me',
    UPDATE_USER: '/api/update',
    UPLOAD_PROFILE_IMAGE: '/api/upload-profile-image',
    
    // Products
    PRODUCTS: '/api/products',
    PRODUCT_BY_ID: (id: number) => `/api/products/${id}`,
    PRODUCTS_BY_COLLECTION: (collection: string) => `/api/products/collection/${encodeURIComponent(collection)}`,
    PRODUCTS_BY_TYPE: (type: string) => `/api/products/type/${encodeURIComponent(type)}`,
    PRODUCTS_SEARCH: '/api/products/search',
    PRODUCTS_BY_CATEGORY: (category: string) => `/api/products/category/${encodeURIComponent(category)}`,
    PRODUCTS_BY_BRAND: '/api/products/brand',
    PRODUCTS_BY_PRICE_RANGE: '/api/products/price-range',
    
    // Favorites
    FAVORITES: '/api/favorites',
    ADD_FAVORITE: '/api/favorites/add',
    REMOVE_FAVORITE: (id: number) => `/api/favorites/remove/${id}`,
    TOGGLE_FAVORITE: '/api/favorites/toggle',
    
    // Cart
    CART: '/api/cart',
    CART_ADD: '/api/cart/add',
    CART_UPDATE: '/api/cart/update',
    CART_REMOVE: '/api/cart/remove',
    CART_CLEAR: '/api/cart/delete',
    
    // Orders
    CREATE_ORDER: '/api/orders/create',
    
    // Cards
    ADD_CARD: '/api/cards/add',
    USER_CARDS: (userId: string) => `/api/cards/user/${userId}`,
    
    // Addresses
    ADDRESSES: '/api/addresses',
    ADD_ADDRESS: '/api/addresses/add',
    USER_ADDRESSES: (userId: string) => `/api/addresses/user/${userId}`,
    UPDATE_ADDRESS: (id: string) => `/api/addresses/${id}`,
    DELETE_ADDRESS: (id: string) => `/api/addresses/${id}`,
    SET_DEFAULT_ADDRESS: (id: string) => `/api/addresses/${id}/default`,
  }
};

export default API_CONFIG;

// Helper function to get full URL
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get endpoint with parameters
export const getEndpoint = (endpointKey: keyof typeof API_CONFIG.ENDPOINTS, ...params: any[]): string => {
  const endpoint = API_CONFIG.ENDPOINTS[endpointKey];
  if (typeof endpoint === 'function') {
    return (endpoint as Function)(...params);
  }
  return endpoint as string;
};