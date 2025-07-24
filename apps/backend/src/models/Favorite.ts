import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  productId: string;
  title: string;
  subtitle?: string;
  price: number;
  image_url: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  productId: { 
    type: String, 
  },
  title: { 
    type: String, 
  },
  subtitle: { 
    type: String 
  },
  price: { 
    type: Number, 
  },
  image_url: { 
    type: String, 
  },
  category: { 
    type: String, 
  }
}, {
  timestamps: true
});

// Index composé pour éviter les doublons (un utilisateur ne peut pas avoir le même produit en favori plusieurs fois)
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema); 