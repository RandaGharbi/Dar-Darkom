import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system';
  title: string;
  message: string;
  data?: Record<string, unknown>; // Données supplémentaires (ex: orderId, promotionId, etc.)
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: Date; // Pour les notifications programmées
  sentAt?: Date; // Quand la notification a été envoyée
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['order_update', 'promotion', 'delivery_update', 'general', 'system'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  scheduledFor: {
    type: Date,
    index: true
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, scheduledFor: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
