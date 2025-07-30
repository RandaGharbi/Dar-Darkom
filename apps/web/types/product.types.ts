export interface Product {
  _id: string;
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
  quantity?: number;
  status?: string;
  productType: 'ingredient' | 'bodyCare' | 'hairCare' | 'skinCare' | 'product';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  title: string;
  description: string;
  price: number;
  category: string;
  productType: string;
  status: string;
  image_url: string;
  product_url: string;
  quantity: number;
}

export interface UpdateProductData {
  name: string;
  title: string;
  description: string;
  price: number;
  category: string;
  productType: string;
  status: string;
  image_url: string;
  product_url: string;
  quantity: number;
}

export interface EditingProduct {
  _id: string;
  name: string;
  title?: string;
  description?: string;
  price: string;
  category: string;
  productType: string;
  status: string;
  image_url?: string;
  product_url?: string;
  quantity?: number;
}

export interface NewProduct {
  name: string;
  title: string;
  description: string;
  price: string;
  category: string;
  productType: string;
  status: string;
  image_url: string;
  product_url: string;
  quantity: number;
} 