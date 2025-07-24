import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/productApi';
import { apiService } from '../services/api';
import { Product } from '../constants/types';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  byType: (type: string) => [...productKeys.all, 'type', type] as const,
  byCategory: (category: string) => [...productKeys.all, 'category', category] as const,
  byBrand: (brand: string) => [...productKeys.all, 'brand', brand] as const,
  byPriceRange: (min: string, max: string) => [...productKeys.all, 'priceRange', min, max] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

// Hook pour récupérer tous les produits
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiService.getProducts();
      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de la récupération des produits');
      }
      return response.data as Product[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les produits par type
export const useProductsByType = (productType: string) => {
  return useQuery({
    queryKey: ['products', 'type', productType],
    queryFn: async () => {
      const response = await apiService.getProductsByType(productType);
      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de la récupération des produits');
      }
      return response.data as Product[];
    },
    enabled: !!productType,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer un produit par ID
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productApi.getProductById(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes pour les détails
  });
};

// Hook pour rechercher des produits
export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productApi.searchProducts(query),
    enabled: !!query && query.length > 2, // Recherche seulement si query > 2 caractères
    staleTime: 2 * 60 * 1000, // 2 minutes pour les recherches
  });
};

// Hook pour récupérer les produits par catégorie
export const useProductsByCategory = (category: string) => {
  // Mapping des catégories vers les productType
  const getProductType = (cat: string) => {
    switch (cat) {
      case 'Face':
        return 'skinCare';
      case 'Body':
        return 'bodyCare';
      case 'Hair':
        return 'hairCare';
      default:
        return null;
    }
  };

  const productType = getProductType(category);

  return useQuery({
    queryKey: ['products', 'type', productType],
    queryFn: async () => {
      if (!productType) {
        // Si c'est "All", récupérer tous les produits
        const data = await productApi.getAllProducts();
        return data as Product[];
      } else {
        // Sinon, récupérer par productType
        const data = await productApi.getProductsByType(productType);
        return data as Product[];
      }
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les produits par marque
export const useProductsByBrand = (brandCreator: string) => {
  return useQuery({
    queryKey: productKeys.byBrand(brandCreator),
    queryFn: () => productApi.getProductsByBrand(brandCreator),
    enabled: !!brandCreator,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour récupérer les produits par gamme de prix
export const useProductsByPriceRange = (minPrice: string, maxPrice: string) => {
  return useQuery({
    queryKey: productKeys.byPriceRange(minPrice, maxPrice),
    queryFn: () => productApi.getProductsByPriceRange(minPrice, maxPrice),
    enabled: !!minPrice && !!maxPrice,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour invalider le cache des produits
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
  };
}; 