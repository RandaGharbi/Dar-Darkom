import mongoose, { Schema } from 'mongoose';

// Interface pour les produits alimentaires
export interface IProduct {
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
  productType: 'pastry' | 'meat' | 'fish' | 'hotDishes' | 'salad' | 'vegetarian';
  nessma_recipe?: {
    url: string;
    description: string;
  };
  dailySpecial: boolean;
}

const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  product_url: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  arrivals: { type: String, default: 'Non' },
  quantity: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  productType: { 
    type: String, 
    required: true, 
    enum: ['pastry', 'meat', 'fish', 'hotDishes', 'salad', 'vegetarian'],
    default: 'pastry'
  },
  dailySpecial: {
    type: Boolean,
    default: false
  },
  nessma_recipe: {
    url: { type: String },
    description: { type: String }
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema); 