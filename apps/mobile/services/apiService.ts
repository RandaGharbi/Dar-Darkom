import httpClient from './httpClient';
import API_CONFIG, { getEndpoint } from '../config/api';
import { Product, FoodProduct } from '../constants/types';

// Type definitions
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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

export interface AddressPayload {
  userId: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  isOrdered?: boolean;
}

class ApiService {
  // Generic request method with error handling
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await httpClient.request({
        method,
        url: endpoint,
        data,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur inconnue',
      };
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.LOGIN, { email, password });
  }

  async register(name: string, email: string, password: string, profileImageUrl?: string): Promise<ApiResponse<any>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.REGISTER, {
      name,
      email,
      password,
      profileImageUrl,
    });
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.LOGOUT);
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('GET', API_CONFIG.ENDPOINTS.ME);
  }

  // Product APIs
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    return this.request('GET', API_CONFIG.ENDPOINTS.PRODUCTS);
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    return this.request('GET', getEndpoint('PRODUCT_BY_ID', id));
  }

  async getProductsByCollection(collection: string): Promise<ApiResponse<Product[]>> {
    return this.request('GET', getEndpoint('PRODUCTS_BY_COLLECTION', collection));
  }

  async getProductsByType(type: string): Promise<ApiResponse<Product[]>> {
    return this.request('GET', getEndpoint('PRODUCTS_BY_TYPE', type));
  }

  async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    return this.request('GET', getEndpoint('PRODUCTS_BY_CATEGORY', category));
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.PRODUCTS_SEARCH, { query });
  }

  async getProductsByBrand(brandCreator: string): Promise<ApiResponse<Product[]>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.PRODUCTS_BY_BRAND, { brandCreator });
  }

  // Récupérer les produits par gamme de prix
  async getProductsByPriceRange(minPrice: string, maxPrice: string): Promise<ApiResponse<Product[]>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.PRODUCTS_BY_PRICE_RANGE, { minPrice, maxPrice });
  }

  // Récupérer les plats du jour (produits avec dailySpecial = true)
  async getDailySpecialProducts(): Promise<ApiResponse<FoodProduct[]>> {
    console.log('🔍 [apiService] getDailySpecialProducts - Début');
    console.log('🔍 [apiService] URL complète:', `${this.baseUrl}${API_CONFIG.ENDPOINTS.DAILY_SPECIAL}`);
    
    try {
      const response = await this.request('GET', API_CONFIG.ENDPOINTS.DAILY_SPECIAL);
      console.log('📡 [apiService] getDailySpecialProducts - Réponse:', response);
      return response;
    } catch (error) {
      console.error('💥 [apiService] getDailySpecialProducts - Erreur:', error);
      throw error;
    }
  }



  // Cart APIs
  async getCart(userId: string): Promise<ApiResponse<Cart>> {
    return this.request('GET', `${API_CONFIG.ENDPOINTS.CART}?userId=${userId}`);
  }

  async addToCart(userId: string, productId: string): Promise<ApiResponse<Cart>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.CART_ADD, { userId, productId });
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.CART_UPDATE, { userId, productId, quantity });
  }

  async removeFromCart(userId: string, productId: string): Promise<ApiResponse<Cart>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.CART_REMOVE, { userId, productId });
  }

  async clearCart(userId: string): Promise<ApiResponse<Cart>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.CART_CLEAR, { userId });
  }

  // Order APIs
  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.CREATE_ORDER, orderData);
  }

  // Card APIs
  async addCard(cardData: Card): Promise<ApiResponse<any>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.ADD_CARD, cardData);
  }

  async getUserCards(userId: string): Promise<ApiResponse<Card[]>> {
    return this.request('GET', getEndpoint('USER_CARDS', userId));
  }

  // Address APIs
  async addAddress(address: AddressPayload): Promise<ApiResponse<any>> {
    return this.request('POST', API_CONFIG.ENDPOINTS.ADD_ADDRESS, address);
  }

  async getUserAddresses(userId: string): Promise<ApiResponse<AddressPayload[]>> {
    return this.request('GET', getEndpoint('USER_ADDRESSES', userId));
  }

  async updateAddress(addressId: string, address: AddressPayload): Promise<ApiResponse<any>> {
    return this.request('PUT', getEndpoint('UPDATE_ADDRESS', addressId), address);
  }

  async deleteAddress(addressId: string): Promise<ApiResponse<any>> {
    return this.request('DELETE', getEndpoint('DELETE_ADDRESS', addressId));
  }

  async setDefaultAddress(addressId: string, userId: string): Promise<ApiResponse<any>> {
    return this.request('PATCH', getEndpoint('SET_DEFAULT_ADDRESS', addressId), {
      addressId,
      userId,
    });
  }
}

export const apiService = new ApiService();
export default apiService;