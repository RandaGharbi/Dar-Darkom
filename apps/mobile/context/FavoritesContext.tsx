import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

interface FavoritesContextType {
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les favoris depuis AsyncStorage au démarrage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: FavoriteProduct[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  };

  const addToFavorites = async (product: FavoriteProduct) => {
    try {
      const newFavorites = [...favorites, product];
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      console.log('✅ Produit ajouté aux favoris:', product.name);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout aux favoris:', error);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      const newFavorites = favorites.filter(fav => fav._id !== productId);
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      console.log('✅ Produit supprimé des favoris:', productId);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des favoris:', error);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav._id === productId);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
