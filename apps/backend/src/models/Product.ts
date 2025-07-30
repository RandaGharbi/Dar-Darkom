import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  product_url: { type: String, required: false, default: '' },
  image_url: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  customerRating: { type: Number },
  numberOfReviews: { type: Number },
  productCollection: { type: String },
  productBrand: { type: String },
  typeOfCare: { type: String },
  category: { type: String, required: true },
  arrivals: { type: String },
  productType: { 
    type: String, 
    required: true, 
    enum: ['ingredient', 'bodyCare', 'hairCare', 'skinCare', 'product'],
    default: 'product'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  quantity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema); 