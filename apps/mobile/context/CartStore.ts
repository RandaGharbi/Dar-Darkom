import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient';
import API_CONFIG from '../config/api';

export type CartItem = {
  productId: string;
  quantity: number;
  product?: any;
};

export type Cart = {
  userId: string;
  items: CartItem[];
  isOrdered?: boolean;
};

interface CartState {
  cart: Cart | null;
  loading: boolean;
  fetchCart: (userId: string) => Promise<void>;
  refreshCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, productId: string) => Promise<void>;
  updateCartItem: (userId: string, productId: string, quantity: number) => Promise<void>;
  removeFromCart: (userId: string, productId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  checkout: (userId: string) => Promise<any>;
  setLoading: (loading: boolean) => void;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  resetCart: () => {
    set({ cart: null, loading: false });
  },

  // Force le rechargement du panier
  refreshCart: async (userId: string) => {
    if (!userId) return;
    set({ loading: true, cart: null });
    try {
      const res = await httpClient.get(`${API_CONFIG.ENDPOINTS.CART}?userId=${userId}`);
      console.log('Panier rechargé:', res.data);
      set({ cart: res.data, loading: false });
    } catch (e) {
      console.error('Erreur rechargement panier:', e);
      set({ loading: false });
    }
  },

  // Récupère le panier depuis le backend
  fetchCart: async (userId: string) => {
    if (!userId) return;
    
    // Éviter de recharger si déjà en cours ou si déjà chargé
    const state = get();
    if (state.loading || state.cart) return;
    
    set({ loading: true });
    try {
      const res = await httpClient.get(`${API_CONFIG.ENDPOINTS.CART}?userId=${userId}`);
      console.log('Panier récupéré:', res.data);
      set({ cart: res.data, loading: false });
    } catch (e) {
      console.error('Erreur récupération panier:', e);
      set({ loading: false });
    }
  },

  // Ajoute un produit au panier
  addToCart: async (userId: string, productId: string): Promise<boolean> => {
    if (!userId || !productId) {
      console.error('addToCart: userId ou productId manquant', { userId, productId });
      return false;
    }
    
    console.log('addToCart appelé avec:', { userId, productId });
    console.log('Types:', { userIdType: typeof userId, productIdType: typeof productId });
    
    // Optimistic update immédiat
    set((state) => {
      if (!state.cart) {
        const newCart = { userId, items: [{ productId, quantity: 1 }] };
        console.log('Nouveau panier créé:', newCart);
        return { cart: newCart };
      }
      
      const existing = state.cart.items.find(item => item.productId === productId);
      if (existing) {
        console.log('Produit existant trouvé, incrémentation');
        return {
          cart: {
            ...state.cart,
            items: state.cart.items.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        };
      } else {
        console.log('Nouveau produit ajouté');
        return {
          cart: {
            ...state.cart,
            items: [...state.cart.items, { productId, quantity: 1 }],
          }
        };
      }
    });

    set({ loading: true });
    try {
      const requestBody = {
        userId: userId.toString(),
        productId: productId.toString()
      };
      
      console.log('Envoi requête au serveur:', {
        requestBody,
        endpoint: API_CONFIG.ENDPOINTS.CART_ADD,
        fullUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_ADD}`
      });
      
      const response = await httpClient.post(API_CONFIG.ENDPOINTS.CART_ADD, requestBody);
      console.log('Réponse serveur:', response.data);
      
      // Synchronise avec la réponse du backend
      set({ cart: response.data, loading: false });
      return true;
    } catch (e: any) {
      console.error('Erreur lors de l\'ajout au panier:', e);
      console.error('Détails de l\'erreur:', e.response?.data);
      console.error('Status:', e.response?.status);
      console.error('Headers:', e.response?.headers);
      
      // Rollback en cas d'erreur
      await get().fetchCart(userId);
      set({ loading: false });
      return false;
    }
  },

  // Met à jour la quantité d'un produit
  updateCartItem: async (userId: string, productId: string, quantity: number) => {
    if (!userId || !productId) return;
    
    set({ loading: true });
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CART_UPDATE, {
        userId,
        productId,
        quantity
      });
      set({ cart: res.data, loading: false });
    } catch (e) {
      console.error('Erreur mise à jour panier:', e);
      set({ loading: false });
    }
  },

  // Retire un produit du panier
  removeFromCart: async (userId: string, productId: string) => {
    if (!userId || !productId) return;
    
    set({ loading: true });
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CART_REMOVE, {
        userId,
        productId
      });
      set({ cart: res.data, loading: false });
    } catch (e) {
      console.error('Erreur retrait panier:', e);
      set({ loading: false });
    }
  },

  // Vide le panier
  clearCart: async (userId: string) => {
    if (!userId) return;
    
    set({ loading: true });
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.CART_CLEAR, {
        userId
      });
      set({ cart: { userId, items: [] }, loading: false });
    } catch (e) {
      console.error('Erreur suppression panier:', e);
      set({ loading: false });
    }
  },

  // Finalise la commande
  checkout: async (userId: string) => {
    if (!userId) return null;
    
    set({ loading: true });
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
        userId
      });
      set({ cart: { userId, items: [] }, loading: false });
      return res.data;
    } catch (e) {
      console.error('Erreur checkout:', e);
      set({ loading: false });
      return null;
    }
  },
})); 