import mongoose, { Document, Schema } from 'mongoose';

export interface IAudioTrack extends Document {
  id: string;
  title: string;
  youtubeId: string;
  duration: number; // en secondes
  category: 'traditional' | 'ambient' | 'classical';
  description: string;
  thumbnailUrl: string;
  isActive: boolean;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AudioTrackSchema = new Schema<IAudioTrack>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  youtubeId: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['traditional', 'ambient', 'classical'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  playCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index pour les recherches
AudioTrackSchema.index({ category: 1, isActive: 1 });
AudioTrackSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IAudioTrack>('AudioTrack', AudioTrackSchema);
