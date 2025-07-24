import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import httpClient from '../services/httpClient';
import API_CONFIG, { getFullUrl } from '../config/api';


export type CartItem = {
  productId: string;
  quantity: number;
  product?: any; // Peut être typé plus précisément si besoin
};

export type Cart = {
  userId: string;
  items: CartItem[];
  isOrdered?: boolean;
};

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const res = await httpClient.get(`${API_CONFIG.ENDPOINTS.CART}?userId=${user._id}`);
      console.log('Panier récupéré:', res.data);
      setCart(res.data);
    } catch (e) {
      console.error('Erreur récupération panier:', e);
      Alert.alert('Erreur', 'Impossible de récupérer le panier');
    }
    setLoading(false);
  };

  const addToCart = async (productId: string) => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.CART_ADD, {
        userId: user._id,
        productId
      });
      console.log('Produit ajouté, rechargement du panier...');
      // Recharger le panier complet depuis le serveur
      await fetchCart();
    } catch (e: any) {
      console.error('Erreur ajout panier:', e);
      Alert.alert('Erreur', e?.message || 'Impossible d\'ajouter au panier');
      throw e; // Relancer l'erreur pour le catch dans shop.tsx
    }
    setLoading(false);
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CART_UPDATE, {
        userId: user._id,
        productId,
        quantity
      });
      setCart(res.data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le panier');
    }
    setLoading(false);
  };

  const removeFromCart = async (productId: string) => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CART_REMOVE, {
        userId: user._id,
        productId
      });
      setCart(res.data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de retirer du panier');
    }
    setLoading(false);
  };

  const clearCart = async () => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.CART_CLEAR, {
        userId: user._id
      });
      setCart({ userId: user._id!, items: [] });
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de supprimer le panier');
    }
    setLoading(false);
  };

  const checkout = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
        userId: user._id
      });
      setCart({ userId: user._id, items: [] });
      return res.data;
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de finaliser la commande');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
    else setCart(null);
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};