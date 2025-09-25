import mongoose, { Document, Schema } from 'mongoose';

export interface IDriver extends Document {
  userId: mongoose.Types.ObjectId;
  licenseNumber: string;
  vehicleType: 'bike' | 'scooter' | 'car' | 'motorcycle';
  vehicleModel?: string;
  vehiclePlate?: string;
  isOnline: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    lastUpdated: Date;
  };
  deliveryZone?: string[];
  rating: number;
  totalDeliveries: number;
  isAvailable: boolean;
  maxDeliveryRadius: number; // en km
  workingHours: {
    start: string; // format "HH:MM"
    end: string;   // format "HH:MM"
    days: number[]; // [0,1,2,3,4,5,6] pour dimanche à samedi
  };
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  documents: {
    licenseImage?: string;
    vehicleImage?: string;
    insuranceImage?: string;
    idCardImage?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'scooter', 'car', 'motorcycle'],
    required: true
  },
  vehicleModel: {
    type: String,
    required: false
  },
  vehiclePlate: {
    type: String,
    required: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    address: { type: String, required: false },
    lastUpdated: { type: Date, default: Date.now }
  },
  deliveryZone: [{
    type: String,
    required: false
  }],
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  maxDeliveryRadius: {
    type: Number,
    default: 10 // 10km par défaut
  },
  workingHours: {
    start: { type: String, required: true, default: "08:00" },
    end: { type: String, required: true, default: "20:00" },
    days: { type: [Number], required: true, default: [1,2,3,4,5] } // Lundi à Vendredi
  },
  bankAccount: {
    accountNumber: { type: String, required: false },
    bankName: { type: String, required: false },
    accountHolderName: { type: String, required: false }
  },
  documents: {
    licenseImage: { type: String, required: false },
    vehicleImage: { type: String, required: false },
    insuranceImage: { type: String, required: false },
    idCardImage: { type: String, required: false }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
DriverSchema.index({ userId: 1 });
DriverSchema.index({ isOnline: 1, isAvailable: 1 });
DriverSchema.index({ status: 1 });
DriverSchema.index({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });

export default mongoose.model<IDriver>('Driver', DriverSchema);

