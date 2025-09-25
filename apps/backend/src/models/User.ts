import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'driver' | 'EMPLOYE' | 'LIVREUR';
  status: 'Active' | 'Inactive';
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  username?: string;
  appleId?: string;
  googleId?: string;
  isOnline?: boolean;
  isEmailVerified?: boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profileImage: { type: String },
  role: { type: String, enum: ['user', 'admin', 'driver', 'EMPLOYE', 'LIVREUR'], default: 'user' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  lastLogin: { type: Date },
  phoneNumber: { type: String },
  address: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String },
  preferredLanguage: { type: String },
  username: { type: String },
  appleId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  isOnline: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
