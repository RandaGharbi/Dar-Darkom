export type RawProduct = {
  id: number;
  title: string;
  product_url: string;
  image_url: string;
  price: number;
  customerRating: number | null;
  numberOfReviews: number;
  collection: string;     
  typeOfCare: string;
  subtitle: string;

};

export type Ingredient = {
  id: number;
  name: string;
  description: string;
  image: string;
};

export type IngredientCategory = {
  category: string;
  ingredients: Ingredient[];
};

export type Product = {
  brand: string | undefined;
  ingredients: string;
  benefits: string;
  howToUse: string;
  id: number;
  name?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  product_url?: string;
  image_url?: string;
  image?: string;
  price: number;
  customerRating?: number;
  numberOfReviews?: number;
  productCollection?: string;
  productBrand?: string;
  typeOfCare?: string;
  category: string;
  arrivals?: string;
  productType: 'ingredient' | 'bodyCare' | 'hairCare' | 'skinCare' | 'product';
};

export type Order = {
  productUrl: string;
};

// src/types/FAQItemType.ts
export type FAQItemType = {
  title: string;
  subtitle: string;
  icon: any; // Accepte un objet image (ex: { uri: string })
};

export type RawShop = {
  id: number;
  Subtitle:  string;
  Name:  string;
  product_url:  string;
  Image: string;
  price: number;
  Arrivals: string;
  category: string;
};