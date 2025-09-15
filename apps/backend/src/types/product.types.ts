// Types pour les données brutes des fichiers JSON - Catégories alimentaires uniquement

export interface RawPastry {
  id: number;
  Subtitle: string;
  Name: string;
  Image: string;
  product_url: string;
  price: number;
  Arrivals: string;
  category: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
}

export interface RawMeat {
  id: number;
  Subtitle: string;
  Name: string;
  Image: string;
  product_url: string;
  price: number;
  Arrivals: string;
  category: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
}

export interface RawFish {
  id: number;
  Subtitle: string;
  Name: string;
  Image: string;
  product_url: string;
  price: number;
  Arrivals: string;
  category: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
}

export interface RawHotDishes {
  id: number;
  Subtitle: string;
  Name: string;
  Image: string;
  product_url: string;
  price: number;
  Arrivals: string;
  category: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
}

export interface RawSalad {
  id: number;
  Subtitle: string;
  Name: string;
  Image: string;
  product_url: string;
  price: number;
  Arrivals: string;
  category: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
}

export interface RawVegetarian {
  id: number;
  Subtitle: string;
  Name: string;
  Image: string;
  product_url: string;
  price: number;
  Arrivals: string;
  category: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
}

// Types pour les produits transformés
export type ProductType = 'pastry' | 'meat' | 'fish' | 'hotDishes' | 'salad' | 'vegetarian';

export interface TransformedPastry {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  quantity: number;
  status: string;
  productType: 'pastry';
  dailySpecial: boolean;
}

export interface TransformedMeat {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  quantity: number;
  status: string;
  productType: 'meat';
  dailySpecial: boolean;
}

export interface TransformedFish {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  quantity: number;
  status: string;
  productType: 'fish';
  dailySpecial: boolean;
}

export interface TransformedHotDishes {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  quantity: number;
  status: string;
  productType: 'hotDishes';
  dailySpecial: boolean;
}

export interface TransformedSalad {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  quantity: number;
  status: string;
  productType: 'salad';
  dailySpecial: boolean;
}

export interface TransformedVegetarian {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  quantity: number;
  status: string;
  productType: 'vegetarian';
  dailySpecial: boolean;
}

// Type union pour tous les produits transformés
export type TransformedProduct = 
  | TransformedPastry
  | TransformedMeat
  | TransformedFish
  | TransformedHotDishes
  | TransformedSalad
  | TransformedVegetarian;

// Types pour l'import
export interface ImportResult {
  type: string;
  count?: number;
  error?: string;
}

export interface ImportResponse {
  message: string;
  totalImported: number;
  importResults: ImportResult[];
  statistics: any[];
} 