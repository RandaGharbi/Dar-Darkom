import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscount extends Document {
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxUses: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  applicableTo: 'all' | 'specific_products' | 'specific_categories';
  description?: string;
  discountCollection?: string; // Pour identifier les collections spéciales comme "jours des soldes"
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  minAmount: { 
    type: Number, 
    default: 0 
  },
  maxUses: { 
    type: Number, 
    required: true 
  },
  usedCount: { 
    type: Number, 
    default: 0 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  applicableTo: { 
    type: String, 
    enum: ['all', 'specific_products', 'specific_categories'], 
    default: 'all' 
  },
  description: { 
    type: String 
  },
  discountCollection: { 
    type: String,
    default: 'general' // 'general', 'soldes_france', etc.
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
// DiscountSchema.index({ code: 1 }); // doublon inutile car unique: true
DiscountSchema.index({ active: 1 });
DiscountSchema.index({ discountCollection: 1 });
DiscountSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<IDiscount>('Discount', DiscountSchema); 