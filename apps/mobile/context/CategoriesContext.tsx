import React, { createContext, useContext, useState, ReactNode } from 'react';

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

type CategoriesContextType = {
  categories: Category[];
  selectedCategory: string | null;
  selectCategory: (categoryId: string) => void;
  clearSelection: () => void;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories] = useState<Category[]>([
    {
      id: 'hot-dishes',
      name: 'Plats Chauds',
      icon: 'flame',
      description: 'Cuisine traditionnelle chaude',
      color: '#FF6B35'
    },
    {
      id: 'meats',
      name: 'Viandes',
      icon: 'restaurant',
      description: 'Viandes de qualité',
      color: '#D4A5A5'
    },
    {
      id: 'starters-salads',
      name: 'Entrées & Salades',
      icon: 'restaurant',
      description: 'Entrées fraîches et salades',
      color: '#4ECDC4'
    },
    {
      id: 'pastries',
      name: 'Pâtisserie',
      icon: 'cake',
      description: 'Desserts et pâtisseries',
      color: '#FFE66D'
    },
    {
      id: 'seafood',
      name: 'Poissons',
      icon: 'fish',
      description: 'Produits de la mer frais',
      color: '#45B7D1'
    },
    {
      id: 'vegetarian',
      name: 'Végé',
      icon: 'leaf',
      description: 'Options végétariennes',
      color: '#95E1D3'
    }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const clearSelection = () => {
    setSelectedCategory(null);
  };

  return (
    <CategoriesContext.Provider value={{ categories, selectedCategory, selectCategory, clearSelection }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error('useCategories must be used within a CategoriesProvider');
  return context;
};