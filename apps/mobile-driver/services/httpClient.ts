import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api';

// Configuration pour les retries
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 seconde
  retryCondition: (error: any) => {
    // Retry pour les timeouts et erreurs réseau
    return error.code === 'ECONNABORTED' || 
           error.message.includes('timeout') ||
           error.code === 'NETWORK_ERROR' ||
           error.message === 'Network Error';
  }
};

// Fonction utilitaire pour les retries
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour exécuter une requête avec retry
export const requestWithRetry = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentative ${attempt}/${RETRY_CONFIG.maxRetries} pour ${config.method?.toUpperCase()} ${config.url}`);
      const response = await httpClient(config);
      return response;
    } catch (error: any) {
      lastError = error;
      
      // Vérifier si on doit retry
      if (attempt < RETRY_CONFIG.maxRetries && RETRY_CONFIG.retryCondition(error)) {
        console.log(`⏳ Retry dans ${RETRY_CONFIG.retryDelay}ms... (tentative ${attempt + 1}/${RETRY_CONFIG.maxRetries})`);
        await sleep(RETRY_CONFIG.retryDelay * attempt); // Délai progressif
      } else {
        break;
      }
    }
  }
  
  throw lastError;
};

// Fonction utilitaire pour les requêtes driver spécifiques
export const driverRequest = {
  async getOrders() {
    return requestWithRetry({
      method: 'GET',
      url: API_CONFIG.ENDPOINTS.DRIVER_ORDERS,
    });
  },

  async getActiveOrders() {
    return requestWithRetry({
      method: 'GET',
      url: API_CONFIG.ENDPOINTS.DRIVER_ACTIVE_ORDERS,
    });
  },

  async acceptOrder(orderId: string) {
    return requestWithRetry({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.DRIVER_ACCEPT_ORDER(orderId),
    });
  },

  async rejectOrder(orderId: string, reason?: string) {
    return requestWithRetry({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.DRIVER_REJECT_ORDER(orderId),
      data: { reason },
    });
  },

  async updateLocation(location: { latitude: number; longitude: number; address?: string }) {
    return requestWithRetry({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.DRIVER_LOCATION_UPDATE,
      data: location,
    });
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    return requestWithRetry({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.DRIVER_UPDATE_STATUS(orderId),
      data: { status, notes },
    });
  },
};

// Create axios instance
export const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // Augmenté de 10s à 30s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
httpClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏰ Timeout Error:', {
        message: 'La requête a dépassé le délai d\'attente de 30 secondes',
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        timeout: error.config?.timeout,
        suggestion: 'Vérifiez votre connexion internet ou réessayez plus tard'
      });
    }
    // Handle common errors
    else if (error.response?.status === 401) {
      // Token expired or invalid - only remove token if we have a response
      try {
        await AsyncStorage.removeItem('authToken');
        console.log('Auth token removed due to 401 error');
      } catch (storageError) {
        console.error('Error removing auth token:', storageError);
      }
    } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      // Network error - don't remove token, just log the error
      console.error('🌐 Network Error:', {
        message: 'Erreur de connexion réseau',
        url: error.config?.url,
        suggestion: 'Vérifiez votre connexion internet'
      });
    } else {
      // Other errors - seulement logger si ce n'est pas une erreur 404 attendue
      if (error.response?.status !== 404) {
        console.error('HTTP Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
      } else {
        console.log('⚠️ Endpoint non trouvé:', error.config?.url);
      }
    }
    
    return Promise.reject(error);
  }
);

// Méthodes utilitaires avec retry automatique
export const httpClientWithRetry = {
  get: (url: string, config?: AxiosRequestConfig) => requestWithRetry({ ...config, method: 'GET', url }),
  post: (url: string, data?: any, config?: AxiosRequestConfig) => requestWithRetry({ ...config, method: 'POST', url, data }),
  put: (url: string, data?: any, config?: AxiosRequestConfig) => requestWithRetry({ ...config, method: 'PUT', url, data }),
  patch: (url: string, data?: any, config?: AxiosRequestConfig) => requestWithRetry({ ...config, method: 'PATCH', url, data }),
  delete: (url: string, config?: AxiosRequestConfig) => requestWithRetry({ ...config, method: 'DELETE', url }),
};

export default httpClient;