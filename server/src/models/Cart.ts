import mongoose, { Schema, Types, Document } from 'mongoose';
import { IProduct } from './Product';

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId | (IProduct & { _id: Types.ObjectId });
  quantity: number;
  selectedVariant?: {
    color?: string;
    size?: string;
  };
  price: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedVariant: {
    color: { type: String },
    size: { type: String }
  },
  price: {
    type: Number,
    required: true
  }
});

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [CartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

CartSchema.pre('save', function (this: ICart) {
  this.subtotal = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const Cart = mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
