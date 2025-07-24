// Types pour les données brutes des fichiers JSON
export interface RawIngredientCategory {
  category: string;
  ingredients: Array<{
    id: number;
    name: string;
    description: string;
    image: string;
  }>;
}

export interface RawBodyCare {
  id: number;
  Name: string;
  Subtitle: string;
  Image: string;
  product_url: string;
  price: number;
  category: string;
  Arrivals: string;
}

export interface RawHairCare {
  id: number;
  Subtitle: string;
  Name: string;
  product_url: string;
  Image: string;
  price: number;
  Arrivals: string;
  category: string;
}

export interface RawProduct {
  category: string;
  id: number;
  title: string;
  product_url: string;
  image_url: string;
  price: number;
  customerRating: number;
  numberOfReviews: number;
  collection: string;
  typeOfCare: string;
}

// Types pour les produits transformés
export type ProductType = 'ingredient' | 'bodyCare' | 'hairCare' | 'skinCare' | 'product';

export interface TransformedIngredient {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  product_url: string;
  price: number;
  productType: 'ingredient';
}

export interface TransformedBodyCare {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  productType: 'bodyCare';
}

export interface TransformedHairCare {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  productType: 'hairCare';
}

export interface RawSkinCare {
  id: number;
  Subtitle: string;
  Name: string;
  Image: string;
  product_url: string;
  price: number;
  Arrivals: string;
  category: string;
}

export interface TransformedSkinCare {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  productType: 'skinCare';
}

export interface TransformedProduct {
  id: number;
  name: string;
  title: string;
  image_url: string;
  product_url: string;
  price: number;
  customerRating: number;
  numberOfReviews: number;
  productBrand: string;
  typeOfCare: string;
  category: string;
  productType: 'product';
}

// Type union pour tous les produits transformés
export type TransformedProductUnion = 
  | TransformedIngredient 
  | TransformedBodyCare 
  | TransformedHairCare 
  | TransformedSkinCare
  | TransformedProduct;

// Types pour les résultats d'importation
export interface ImportResult {
  type: string;
  count?: number;
  error?: string;
}

export interface ImportStatistics {
  _id: ProductType;
  count: number;
  avgPrice: number;
}

export interface ImportResponse {
  message: string;
  totalImported: number;
  importResults: ImportResult[];
  statistics: ImportStatistics[];
} 