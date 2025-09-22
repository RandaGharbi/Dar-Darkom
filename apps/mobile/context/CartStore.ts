import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient';
import API_CONFIG from '../config/api';

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
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
  addToCart: (userId: string, productId: string) => Promise<boolean>;
  updateCartItem: (userId: string, productId: string, quantity: number) => Promise<void>;
  updateCartItemQuantity: (userId: string, productId: string, quantity: number) => Promise<void>;
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
      
      // Enrichir les items avec les données des produits populées
      const enrichedItems = res.data.items.map((item: any) => {
        const productData = item.productId; // Données populées du produit
        return {
          id: item._id,
          productId: productData?._id || item.productId,
          quantity: item.quantity,
          name: productData?.name || productData?.title || 'Produit sans nom',
          price: productData?.price || 0,
          image: productData?.image,
          product: productData || null
        };
      });
      
      set({ 
        cart: { 
          ...res.data, 
          items: enrichedItems 
        }, 
        loading: false 
      });
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
      console.log('=== PANIER RÉCUPÉRÉ ===');
      console.log('Structure complète:', JSON.stringify(res.data, null, 2));
      console.log('Items du panier:', res.data.items);
      
      // Enrichir les items avec les données des produits populées
      const enrichedItems = res.data.items.map((item: any) => {
        const productData = item.productId; // Données populées du produit
        return {
          id: item._id,
          productId: productData?._id || item.productId,
          quantity: item.quantity,
          name: productData?.name || productData?.title || 'Produit sans nom',
          price: productData?.price || 0,
          image: productData?.image,
          product: productData || null
        };
      });
      
      console.log('=== ITEMS ENRICHIS FINAUX ===');
      console.log('Tous les items enrichis:', JSON.stringify(enrichedItems, null, 2));
      
      set({ 
        cart: { 
          ...res.data, 
          items: enrichedItems 
        }, 
        loading: false 
      });
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
    
    set({ loading: true });
    try {
      // D'abord, récupérer le produit pour obtenir ses données complètes
      const productRes = await httpClient.get(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(productId));
      const product = productRes.data;
      const numericProductId = product.id; // L'ID numérique du produit
      
      console.log('Produit récupéré:', { productId, numericProductId, product });
      
      const requestBody = {
        userId: userId.toString(),
        productId: numericProductId // Utiliser l'ID numérique
      };
      
      console.log('Envoi requête au serveur:', {
        requestBody,
        endpoint: API_CONFIG.ENDPOINTS.CART_ADD,
        fullUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_ADD}`
      });
      
      const response = await httpClient.post(API_CONFIG.ENDPOINTS.CART_ADD, requestBody);
      console.log('Réponse serveur:', response.data);
      
      // Enrichir les données du panier avec les informations des produits
      const enrichedItems = response.data.items.map((item: any) => {
        const productData = item.productId; // Données populées du produit
        return {
          id: item._id,
          productId: productData?._id || item.productId,
          quantity: item.quantity,
          name: productData?.name || productData?.title || 'Produit sans nom',
          price: productData?.price || 0,
          image: productData?.image,
          product: productData || null
        };
      });
      
      // Mettre à jour le panier avec les données enrichies
      set({ 
        cart: { 
          ...response.data, 
          items: enrichedItems 
        }, 
        loading: false 
      });
      
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
      // Utiliser l'ID numérique du produit depuis les données du panier
      const cart = get().cart;
      console.log('Cart complet:', cart);
      console.log('ProductId recherché:', productId);
      
      // Chercher l'item par productId (ObjectId) ou par _id
      const cartItem = cart?.items.find(item => 
        item.productId === productId || 
        item.id === productId ||
        (item.productId && typeof item.productId === 'object' && item.productId._id === productId)
      );
      
      console.log('Cart item trouvé:', cartItem);
      
      // Vérifier si productId est directement l'objet produit ou si c'est dans product
      let numericId = null;
      
      if (cartItem?.product && cartItem.product.id) {
        // Si product existe et a un id, utiliser ses données
        numericId = cartItem.product.id;
        console.log('Utilisation de cartItem.product.id:', numericId);
      } else if (cartItem?.productId && typeof cartItem.productId === 'object' && cartItem.productId.id) {
        // Si productId est directement l'objet produit et a un id
        numericId = cartItem.productId.id;
        console.log('Utilisation de cartItem.productId.id:', numericId);
      }
      
      if (!numericId) {
        console.error('ID numérique du produit non trouvé pour productId:', productId);
        console.error('Cart item complet:', cartItem);
        console.error('Cart item product:', cartItem?.product);
        console.error('Cart item productId:', cartItem?.productId);
        set({ loading: false });
        return;
      }
      
      console.log('Mise à jour quantité:', {
        productId,
        numericId,
        quantity
      });
      
      console.log('Envoi requête updateCartItem:', {
        endpoint: API_CONFIG.ENDPOINTS.CART_UPDATE,
        body: { userId, productId: numericId, quantity }
      });
      
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CART_UPDATE, {
        userId,
        productId: numericId, // Utiliser l'ID numérique du produit
        quantity
      });
      
      console.log('Réponse updateCartItem:', res.data);
      
      // Ne pas remplacer complètement le cart car l'API retourne des données non populées
      // Mettre à jour seulement les quantités dans le state local
      set((state) => {
        if (!state.cart) return { loading: false };
        
        const updatedItems = state.cart.items.map(item => {
          const updatedItem = res.data.items.find((apiItem: any) => 
            apiItem._id === item.id || apiItem._id === item._id
          );
          if (updatedItem) {
            return { ...item, quantity: updatedItem.quantity };
          }
          return item;
        });
        
        return {
          cart: {
            ...state.cart,
            items: updatedItems
          },
          loading: false
        };
      });
    } catch (e) {
      console.error('Erreur mise à jour panier:', e);
      set({ loading: false });
    }
  },

  // Alias pour updateCartItem (utilisé dans le composant cart)
  updateCartItemQuantity: async (userId: string, productId: string, quantity: number) => {
    return get().updateCartItem(userId, productId, quantity);
  },

  // Retire un produit du panier
  removeFromCart: async (userId: string, productId: string) => {
    if (!userId || !productId) return;
    
    set({ loading: true });
    try {
      // Utiliser l'ID numérique du produit depuis les données du panier
      const cart = get().cart;
      console.log('Cart complet pour suppression:', cart);
      console.log('ProductId recherché:', productId);
      
      // Chercher l'item par productId (ObjectId) ou par _id
      const cartItem = cart?.items.find(item => 
        item.productId === productId || 
        item.id === productId ||
        (item.productId && typeof item.productId === 'object' && item.productId._id === productId)
      );
      
      console.log('Cart item trouvé pour suppression:', cartItem);
      
      // Vérifier si productId est directement l'objet produit ou si c'est dans product
      let numericId = null;
      
      if (cartItem?.product && cartItem.product.id) {
        // Si product existe et a un id, utiliser ses données
        numericId = cartItem.product.id;
        console.log('Utilisation de cartItem.product.id:', numericId);
      } else if (cartItem?.productId && typeof cartItem.productId === 'object' && cartItem.productId.id) {
        // Si productId est directement l'objet produit et a un id
        numericId = cartItem.productId.id;
        console.log('Utilisation de cartItem.productId.id:', numericId);
      }
      
      if (!numericId) {
        console.error('ID numérique du produit non trouvé pour productId:', productId);
        console.error('Cart item complet:', cartItem);
        console.error('Cart item product:', cartItem?.product);
        console.error('Cart item productId:', cartItem?.productId);
        set({ loading: false });
        return;
      }
      
      console.log('Suppression produit:', {
        productId,
        numericId
      });
      
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CART_REMOVE, {
        userId,
        productId: numericId // Utiliser l'ID numérique du produit
      });
      
      console.log('Réponse removeFromCart:', res.data);
      
      // Ne pas remplacer complètement le cart car l'API retourne des données non populées
      // Mettre à jour seulement les items dans le state local
      set((state) => {
        if (!state.cart) return { loading: false };
        
        const updatedItems = state.cart.items.filter(item => {
          const stillExists = res.data.items.some((apiItem: any) => 
            apiItem._id === item.id || apiItem._id === item._id
          );
          return stillExists;
        });
        
        return {
          cart: {
            ...state.cart,
            items: updatedItems
          },
          loading: false
        };
      });
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