import mongoose, { Document, Schema } from 'mongoose';

export interface IUserNotificationSettings extends Document {
  userId: mongoose.Types.ObjectId;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  deliveryUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: boolean;
  quietStartTime: string; // Format HH:MM
  quietEndTime: string; // Format HH:MM
  emailNotifications: boolean;
  smsNotifications: boolean;
  deviceTokens: string[]; // Tokens pour les notifications push
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserNotificationSettingsSchema = new Schema<IUserNotificationSettings>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  orderUpdates: {
    type: Boolean,
    default: true
  },
  promotions: {
    type: Boolean,
    default: true
  },
  deliveryUpdates: {
    type: Boolean,
    default: true
  },
  soundEnabled: {
    type: Boolean,
    default: true
  },
  vibrationEnabled: {
    type: Boolean,
    default: true
  },
  quietHours: {
    type: Boolean,
    default: false
  },
  quietStartTime: {
    type: String,
    default: '22:00',
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  quietEndTime: {
    type: String,
    default: '08:00',
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  deviceTokens: [{
    type: String,
    maxlength: 200
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les requêtes
UserNotificationSettingsSchema.index({ userId: 1 });

export default mongoose.model<IUserNotificationSettings>('UserNotificationSettings', UserNotificationSettingsSchema);
