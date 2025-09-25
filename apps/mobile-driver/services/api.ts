import httpClient from './httpClient';
import API_CONFIG, { getFullUrl, getEndpoint } from '../config/api';

export const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  arrivals: string;
  category: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
  nessma_recipe?: string;
}

export interface Card {
  _id?: string;
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
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const method = (options?.method || 'GET').toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...options?.headers,
      };
      
      let response;
      if (method === 'get') {
        response = await httpClient.get(endpoint, { headers });
      } else if (method === 'post') {
        response = await httpClient.post(endpoint, options?.body ? JSON.parse(options.body as string) : undefined, { headers });
      } else if (method === 'put') {
        response = await httpClient.put(endpoint, options?.body ? JSON.parse(options.body as string) : undefined, { headers });
      } else if (method === 'patch') {
        response = await httpClient.patch(endpoint, options?.body ? JSON.parse(options.body as string) : undefined, { headers });
      } else if (method === 'delete') {
        response = await httpClient.delete(endpoint, { headers });
      } else {
        throw new Error(`Méthode HTTP non supportée: ${method}`);
      }

      const data = response.data;
      // Si la réponse est déjà un tableau, on le retourne dans le format attendu
      if (Array.isArray(data)) {
        return { success: true, data };
      }
      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        return {
          success: false,
          error: 'Network error - check if backend is running on 192.168.1.74:5000'
        };
      }
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  // Produits
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await httpClient.get(API_CONFIG.ENDPOINTS.PRODUCTS);
      const data = response.data;
      
      // Si la réponse est déjà un tableau, on le retourne dans le format attendu
      if (Array.isArray(data)) {
        return { success: true, data };
      }
      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(getEndpoint('PRODUCT_BY_ID', id));
  }

  async getProductsByCollection(collection: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(getEndpoint('PRODUCTS_BY_COLLECTION', collection));
  }

  async getProductsByType(typeOfCare: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(getEndpoint('PRODUCTS_BY_TYPE', typeOfCare));
  }

  // Récupérer les plats du jour (produits avec dailySpecial = true)
  async getDailySpecialProducts(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_CONFIG.ENDPOINTS.DAILY_SPECIAL);
  }

  // Récupérer les produits de poisson
  async getFishProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/api/products/type/fish');
  }

  // Récupérer les produits végétariens
  async getVegetarianProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/api/products/type/vegetarian');
  }

  // Récupérer les produits de viande
  async getMeatProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/api/products/category/Viandes');
  }

  // Récupérer les produits de salade
  async getSaladProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/api/products/type/salad');
  }

  // Récupérer toutes les catégories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(API_CONFIG.ENDPOINTS.PRODUCT_CATEGORIES);
  }



  // Authentification
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Cartes bancaires
  async addCard(cardData: Card, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_CONFIG.ENDPOINTS.ADD_CARD, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Ajout du header manquant
      },
      body: JSON.stringify(cardData),
    });
  }

  async getCards(token: string, userId: string): Promise<ApiResponse<Card[]>> {
    return this.request<Card[]>(getEndpoint('USER_CARDS', userId), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Commandes
  async createOrder(orderData: any, token?: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
  }
}

export const apiService = new ApiService();

export interface AddressPayload {
  userId: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const addAddress = async (address: AddressPayload) => {
  const res = await httpClient.post(API_CONFIG.ENDPOINTS.ADD_ADDRESS, address);
  return res.data;
};

export const getAddressesByUser = async (userId: string) => {
  const res = await httpClient.get(getEndpoint('USER_ADDRESSES', userId));
  return res.data;
};

export const updateAddress = async (addressId: string, address: AddressPayload) => {
  const res = await httpClient.put(getEndpoint('UPDATE_ADDRESS', addressId), address);
  return res.data;
};

export const deleteAddress = async (addressId: string) => {
  const res = await httpClient.delete(getEndpoint('DELETE_ADDRESS', addressId));
  return res.data;
};

export const setDefaultAddress = async (addressId: string, userId: string) => {
  const res = await httpClient.patch(getEndpoint('SET_DEFAULT_ADDRESS', addressId), { addressId, userId });
  return res.data;
};