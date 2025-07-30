import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  content: string;
  isFromUser: boolean;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isFromUser: {
    type: Boolean,
    required: true,
    default: true
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
MessageSchema.index({ userId: 1, createdAt: -1 });
MessageSchema.index({ isFromUser: 1, isRead: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema); 