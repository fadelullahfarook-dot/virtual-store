import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  identifier: string; // email or phone
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  identifier: { type: String, required: true },
  // In a production app, OTP should be hashed if stored persistently,
  // but a TTL index is usually sufficient for short-lived OTPs.
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '5m' }, // Auto delete after 5 minutes
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IOtp>('Otp', otpSchema);
