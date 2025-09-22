import mongoose, { Document, Schema } from 'mongoose';

export interface ITracking extends Document {
  orderId: mongoose.Types.ObjectId;
  status: 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  deliveryNotes?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TrackingSchema: Schema = new Schema({
  orderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true,
    unique: true 
  },
  status: { 
    type: String, 
    enum: ['preparing', 'ready', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'preparing',
    required: true 
  },
  driverId: { 
    type: String,
    required: false 
  },
  driverName: { 
    type: String,
    required: false 
  },
  driverPhone: { 
    type: String,
    required: false 
  },
  currentLocation: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    address: { type: String, required: false }
  },
  estimatedDeliveryTime: { 
    type: Date,
    required: false 
  },
  actualDeliveryTime: { 
    type: Date,
    required: false 
  },
  deliveryNotes: { 
    type: String,
    required: false 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
TrackingSchema.index({ orderId: 1 });
TrackingSchema.index({ status: 1 });
TrackingSchema.index({ driverId: 1 });

export default mongoose.model<ITracking>('Tracking', TrackingSchema);

