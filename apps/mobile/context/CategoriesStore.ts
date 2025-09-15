import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface CategoriesState {
  categories: any[];
  selectedCategory: string | null;
  hydrate: () => Promise<void>;
  selectCategory: (categoryId: string) => void;
  clearSelection: () => void;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  selectedCategory: null,

  // Hydrate les catégories depuis le local storage
  hydrate: async () => {
    try {
      const cats = await AsyncStorage.getItem('categories');
      const localCategories = cats ? JSON.parse(cats) : [];
      set({ categories: localCategories });
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      set({ categories: [] });
    }
  },

  // Sélectionne une catégorie
  selectCategory: (categoryId: string) => {
    set({ selectedCategory: categoryId });
  },

  // Efface la sélection
  clearSelection: () => {
    set({ selectedCategory: null });
  },
})); 