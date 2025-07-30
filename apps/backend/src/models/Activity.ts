import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'order' | 'favorite' | 'payment' | 'profile' | 'login' | 'logout';
  title: string;
  description: string;
  details?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['order', 'favorite', 'payment', 'profile', 'login', 'logout'],
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  details: { 
    type: String 
  },
  metadata: { 
    type: Schema.Types.Mixed 
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes par utilisateur et date
ActivitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', ActivitySchema); 