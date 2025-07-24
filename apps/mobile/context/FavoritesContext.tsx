import React, { createContext, useContext, useState, ReactNode } from 'react';

type Product = {
  uniqueId: string;
  title: string;
  subtitle?: string;
  price: number;
  image_url: string;
};

type FavoritesContextType = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productUniqueId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) =>
      prev.some((p) => p.uniqueId === product.uniqueId)
        ? prev.filter((p) => p.uniqueId !== product.uniqueId)
        : [...prev, product]
    );
  };

  const isFavorite = (productUniqueId: string) => favorites.some((p) => p.uniqueId === productUniqueId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};