import axios from 'axios';
import httpClient from './httpClient';
import API_CONFIG, { getFullUrl, getEndpoint } from '../config/api';

export interface Product {
  id: number;
  title: string;
  product_url: string;
  image_url: string;
  price: number;
  customerRating: number | null;
  numberOfReviews: number;
  productCollection: string;
  typeOfCare: string;
  subtitle: string;
  name?: string;
  category?: string;
  image?: string;
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
      const url = getFullUrl(endpoint);
      
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        return {
          success: false,
          error: 'Network error - check if backend is running on localhost:5000'
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
    return this.request<Product[]>(API_CONFIG.ENDPOINTS.PRODUCTS);
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

  // Favoris
  async getFavorites(token: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_CONFIG.ENDPOINTS.FAVORITES, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addToFavorites(product: Product, token: string): Promise<ApiResponse<any>> {
    const body = {
      productId: product.id,
      title: product.title || product.name,
      subtitle: product.subtitle || '',
      price: product.price,
      image_url: product.image_url || product.image || '',
      category: product.category,
    };
    return this.request<any>(API_CONFIG.ENDPOINTS.ADD_FAVORITE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Ajout du header manquant
      },
      body: JSON.stringify(body),
    });
  }

  async removeFromFavorites(productId: number, token: string): Promise<ApiResponse<any>> {
    const endpoint = getEndpoint('REMOVE_FAVORITE', productId);
    return this.request<any>(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async toggleFavorite(productId: number, token: string): Promise<ApiResponse<any>> {
    const body = { productId };
    return this.request<any>(API_CONFIG.ENDPOINTS.TOGGLE_FAVORITE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
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
        'Content-Type': 'application/json', // Ajout du header manquant
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