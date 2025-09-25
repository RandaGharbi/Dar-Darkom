// Configuration API simple
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.73:5000',
  
  ENDPOINTS: {
    // Health check endpoint
    HEALTH: '/api/health',
    
    // Driver specific endpoints
    DRIVER_LOGIN: '/api/driver/login',
    DRIVER_ORDERS: '/api/driver/orders',
    DRIVER_ACTIVE_ORDERS: '/api/driver/orders/active',
    DRIVER_ACCEPT_ORDER: (orderId: string) => `/api/driver/orders/${orderId}/accept`,
    DRIVER_REJECT_ORDER: (orderId: string) => `/api/driver/orders/${orderId}/reject`,
    DRIVER_UPDATE_STATUS: (orderId: string) => `/api/driver/orders/${orderId}/status`,
    DRIVER_LOCATION_UPDATE: '/api/driver/location',
    
    // Products endpoints
    PRODUCTS: '/api/products',
    PRODUCTS_BY_TYPE: (type: string) => `/api/products/type/${type}`,
    PRODUCTS_BY_CATEGORY: (category: string) => `/api/products/category/${category}`,
    PRODUCTS_BY_COLLECTION: (collection: string) => `/api/products/collection/${collection}`,
    PRODUCTS_SEARCH: '/api/products/search',
    PRODUCTS_BY_BRAND: '/api/products/brand',
    PRODUCTS_BY_PRICE_RANGE: (minPrice: string, maxPrice: string) => `/api/products/price?min=${minPrice}&max=${maxPrice}`,
    DAILY_SPECIAL: '/api/products/daily-special',
  }
};

export default API_CONFIG;
