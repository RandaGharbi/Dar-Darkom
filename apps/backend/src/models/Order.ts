import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: {
    name: string;
    qty: number;
    image: string;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: Date;
  isOrdered: boolean;
  status: 'active' | 'completed' | 'cancelled' | 'confirmed' | 'rejected' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'PENDING' | 'READY' | 'CANCELLED';
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentIntentId?: string;
  livreurId?: mongoose.Types.ObjectId;
  qrCode?: string;
}

// OrderItemSchema definition removed as it's not used
// const OrderItemSchema = new Schema<IOrderItem>({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//   quantity: { type: Number },
//   price: { type: Number },
// });

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      name: String,
      qty: Number,
      image: String,
      price: Number,
    }
  ],
  subtotal: { type: Number },
  shipping: { type: Number },
  tax: { type: Number },
  total: { type: Number },
  createdAt: { type: Date, default: Date.now },
  isOrdered: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'completed', 'cancelled', 'confirmed', 'rejected', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'PENDING', 'READY', 'CANCELLED'], default: 'active' },
  shippingAddress: {
    fullName: { type: String },
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  paymentMethod: { type: String },
  paymentIntentId: { type: String },
  livreurId: { type: Schema.Types.ObjectId, ref: 'User' },
  qrCode: { type: String },
});

export default mongoose.model<IOrder>('Order', OrderSchema); 