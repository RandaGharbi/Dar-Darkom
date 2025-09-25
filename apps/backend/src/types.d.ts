// Raw data types (as they come from JSON files)
export interface RawPastry {
  id: number;
  Name: string;
  Subtitle: string;
  Image: string;
  product_url: string;
  price: number;
  category: string;
  Arrivals: string;
  quantity: number;
  status: string;
  dailySpecial: boolean;
}

export interface RawMeat {
  id: number;
  Name: string;
  Subtitle: string;
  Image: string;
  product_url: string;
  price: number;
  category: string;
  Arrivals: string;
  quantity: number;
  status: string;
  dailySpecial: boolean;
}

export interface RawFish {
  id: number;
  Name: string;
  Subtitle: string;
  Image: string;
  product_url: string;
  price: number;
  category: string;
  Arrivals: string;
  quantity: number;
  status: string;
  dailySpecial: boolean;
}

export interface RawHotDishes {
  id: number;
  Name: string;
  Subtitle: string;
  Image: string;
  product_url: string;
  price: number;
  category: string;
  Arrivals: string;
  quantity: number;
  status: string;
  dailySpecial: boolean;
}

export interface RawSalad {
  id: number;
  Name: string;
  Subtitle: string;
  Image: string;
  product_url: string;
  price: number;
  category: string;
  Arrivals: string;
  quantity: number;
  status: string;
  dailySpecial: boolean;
}

export interface RawVegetarian {
  id: number;
  Name: string;
  Subtitle: string;
  Image: string;
  product_url: string;
  price: number;
  category: string;
  Arrivals: string;
  quantity: number;
  status: string;
  dailySpecial: boolean;
}

// Base transformed product interface
interface BaseTransformedProduct {
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
  dailySpecial: boolean;
}

// Transformed data types (as they will be stored in database)
export interface TransformedPastry extends BaseTransformedProduct {
  productType: "pastry";
}

export interface TransformedMeat extends BaseTransformedProduct {
  productType: "meat";
}

export interface TransformedFish extends BaseTransformedProduct {
  productType: "fish";
}

export interface TransformedHotDishes extends BaseTransformedProduct {
  productType: "hotDishes";
}

export interface TransformedSalad extends BaseTransformedProduct {
  productType: "salad";
}

export interface TransformedVegetarian extends BaseTransformedProduct {
  productType: "vegetarian";
}

// Union type for all transformed products
export type TransformedProduct = 
  | TransformedPastry 
  | TransformedMeat 
  | TransformedFish 
  | TransformedHotDishes 
  | TransformedSalad 
  | TransformedVegetarian;

// Product type enum
export type ProductType = "pastry" | "meat" | "fish" | "hotDishes" | "salad" | "vegetarian";

// Import result types
export interface ImportResult {
  type: ProductType;
  count?: number;
  error?: string;
}

export interface ImportStatistic {
  _id: ProductType;
  count: number;
  avgPrice?: number;
}

export interface ImportResponse {
  message: string;
  totalImported: number;
  importResults: ImportResult[];
  statistics: ImportStatistic[];
}

// Test response type
export interface TestResponse {
  message: string;
  totalCount: number;
  sampleProducts: any[];
  statistics: ImportStatistic[];
}

// Product interface for database operations
export interface IProduct {
  _id?: string;
  id: number;
  name: string;
  title?: string;
  subtitle?: string;
  image?: string;
  product_url?: string;
  price: number;
  category?: string;
  arrivals?: string;
  quantity?: number;
  status?: string;
  productType?: ProductType;
  dailySpecial?: boolean;
}

// Express Request extension - AJOUTÉ
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        name: string;
      };
    }
  }
}