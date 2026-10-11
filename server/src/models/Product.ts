import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant {
  color?: string;
  size?: string;
  additionalPrice?: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  company?: string;
  storeId: string;
  price: number;
  imageUrl?: string;
  stock: number;
  variants?: IVariant[];
  position?: [number, number, number];
  rotation?: [number, number, number];
  displayType?: 'shelf' | 'table' | 'rack' | 'floor';
}

const VariantSchema: Schema = new Schema({
  color: { type: String },
  size: { type: String },
  additionalPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
});

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String },
    storeId: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    stock: { type: Number, required: true, default: 0 },
    variants: [VariantSchema],
    
    // For 3D display integration
    position: { type: [Number], index: false },
    rotation: { type: [Number], index: false },
    displayType: { type: String, enum: ['shelf', 'table', 'rack', 'floor'] }
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
