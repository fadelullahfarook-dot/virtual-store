import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IOrderItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string;
  price: number;
  quantity: number;
  selectedVariant?: {
    color?: string;
    size?: string;
  };
  subtotal: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'Test Online Payment';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus:
    | 'Pending'
    | 'Confirmed'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedVariant: {
    color: { type: String },
    size: { type: String }
  },
  subtotal: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Test Online Payment'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      ],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
