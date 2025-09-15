import { Product } from '../constants/types';
import httpClient from './httpClient';
import API_CONFIG, { getEndpoint } from '../config/api';

// API functions
export const productApi = {
  // Récupérer tous les produits
  getAllProducts: async (): Promise<Product[]> => {
    const response = await httpClient.get(API_CONFIG.ENDPOINTS.PRODUCTS);
    return response.data;
  },

  // Récupérer les produits par type
  getProductsByType: async (productType: string): Promise<Product[]> => {
    const response = await httpClient.get(getEndpoint('PRODUCTS_BY_TYPE', productType));
    return response.data;
  },

  // Récupérer un produit par ID
  getProductById: async (productId: string): Promise<Product> => {
    const response = await httpClient.get(getEndpoint('PRODUCT_BY_ID', parseInt(productId)));
    return response.data;
  },

  // Rechercher des produits
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.PRODUCTS_SEARCH, { query });
    return response.data;
  },

  // Récupérer les produits par catégorie
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await httpClient.get(getEndpoint('PRODUCTS_BY_CATEGORY', category));
    return response.data;
  },

  // Récupérer les produits par marque
  getProductsByBrand: async (brandCreator: string): Promise<Product[]> => {
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.PRODUCTS_BY_BRAND, { brandCreator });
    return response.data;
  },

  // Récupérer les produits par gamme de prix
  getProductsByPriceRange: async (minPrice: string, maxPrice: string): Promise<Product[]> => {
    const response = await httpClient.get(getEndpoint('PRODUCTS_BY_PRICE_RANGE', minPrice, maxPrice));
    return response.data;
  },

  // Récupérer les plats du jour (produits avec dailySpecial = true)
  getDailySpecialProducts: async (): Promise<Product[]> => {
    const response = await httpClient.get(API_CONFIG.ENDPOINTS.DAILY_SPECIAL);
    return response.data;
  },
}; 