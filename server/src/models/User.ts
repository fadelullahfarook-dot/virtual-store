import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  phone?: string;
  authProvider: 'email' | 'phone' | 'google';
  providerId?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: { type: String, unique: true, sparse: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    authProvider: { type: String, enum: ['email', 'phone', 'google'], required: true },
    providerId: { type: String, unique: true, sparse: true },
    profileImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
