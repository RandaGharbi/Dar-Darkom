import { Document } from 'mongoose';

// Types pour les modèles Mongoose
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  id: number;
  name: string;
  title?: string;
  subtitle?: string;
  description?: string;
  product_url: string;
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
  productType: 'ingredient' | 'bodyCare' | 'hairCare' | 'product';
  createdAt: Date;
  updatedAt: Date;
}

export interface IFavorite extends Document {
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
} 