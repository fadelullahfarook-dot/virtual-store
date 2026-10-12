export interface ProductVariant {
  color?: string;
  size?: string;
  additionalPrice?: number;
  stock: number;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  storeId: string;
  category: string;
  company?: string;
  stock: number;
  variants?: ProductVariant[];
}

export interface Store {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  position?: [number, number, number]; // 3D world position
}

export interface CartItem {
  productId: ProductConfig;
  quantity: number;
  selectedVariant?: {
    color?: string;
    size?: string;
  };
  price: number;
  _id?: string;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
}

export interface User {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  provider?: string;
  profileImage?: string;
}

export type StoreCategory = 'fashion' | 'electronics' | 'grocery' | 'furniture';

export interface ProductConfig extends Product {
  position: [number, number, number];
  rotation?: [number, number, number];
  displayType?: 'shelf' | 'table' | 'rack' | 'floor';
}

export interface StoreConfig {
  id: string;
  name: string;
  category: StoreCategory;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  size: [number, number, number];
  entrancePosition: [number, number, number]; // Relative to store position, or absolute
  products: ProductConfig[];
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedVariant?: {
    color?: string;
    size?: string;
  };
  subtotal: number;
  _id?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}
