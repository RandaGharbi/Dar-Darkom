import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { Product } from '../constants/types';

interface FavoritesState {
  favorites: any[];
  hydrate: (isAuthenticated: boolean, token?: string) => Promise<void>;
  addFavorite: (product: any, isAuthenticated: boolean, token?: string) => Promise<void>;
  removeFavorite: (productId: number, isAuthenticated: boolean, token?: string) => Promise<void>;
  isFavorite: (productId: number | string) => boolean;
  clearFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  // Hydrate les favoris depuis le backend ou le local storage
  hydrate: async (isAuthenticated: boolean, token?: string) => {
    
    if (isAuthenticated && token) {
      const res = await apiService.getFavorites(token);
      if (res.success && res.data) {
        // Le backend peut retourner soit res.data.favorites soit res.data directement
        let favoritesData: any = res.data;
        if (res.data && typeof res.data === 'object' && 'favorites' in res.data) {
          favoritesData = res.data.favorites;
        }
        
        
        if (Array.isArray(favoritesData)) {
          set({ favorites: favoritesData });
        } else {
          set({ favorites: [] });
        }
      } else {
        set({ favorites: [] });
      }
    } else {
      const favs = await AsyncStorage.getItem('favorites');
      const localFavorites = favs ? JSON.parse(favs) : [];
      set({ favorites: localFavorites });
    }
  },

  // Ajoute un favori
  addFavorite: async (product: any, isAuthenticated: boolean, token?: string) => {
    if (isAuthenticated && token) {
      const res = await apiService.addToFavorites(product, token);
      await get().hydrate(true, token);
    } else {
      const favs = [...get().favorites, product];
      await AsyncStorage.setItem('favorites', JSON.stringify(favs));
      set({ favorites: favs });
    }
  },

  // Retire un favori
  removeFavorite: async (productId: number, isAuthenticated: boolean, token?: string) => {
    if (isAuthenticated && token) {
      await apiService.removeFromFavorites(productId, token);
      await get().hydrate(true, token);
    } else {
      const favs = get().favorites.filter((f: any) => {
        // Gérer les deux structures de données
        const id = f.productId || f.id;
        return id !== productId;
      });
      await AsyncStorage.setItem('favorites', JSON.stringify(favs));
      set({ favorites: favs });
    }
  },

  // Vérifie si un produit est en favori
  isFavorite: (productId: number | string) => {
    const favs = get().favorites;
    if (!Array.isArray(favs)) return false;
    return favs.some((f: any) => {
      // Gérer les deux structures de données
      const id = f.productId ?? f.id;
      if (id === undefined || productId === undefined) return false;
      return id.toString() === productId.toString();
    });
  },

  // Vide tous les favoris (utile pour le logout)
  clearFavorites: async () => {
    await AsyncStorage.removeItem('favorites');
    set({ favorites: [] });
  },
})); 