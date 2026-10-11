import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  selectedVariant?: {
    color?: string;
    size?: string;
  };
  price: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
}

const CartItemSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedVariant: {
    color: { type: String },
    size: { type: String }
  },
  price: { type: Number, required: true }
});

const CartSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
    subtotal: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

// Pre-save middleware to calculate subtotal
CartSchema.pre('save', function() {
  this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

export default mongoose.model<ICart>('Cart', CartSchema);
