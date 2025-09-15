import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  role: 'user' | 'admin';
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
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profileImage: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
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
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
