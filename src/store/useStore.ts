import { create } from 'zustand';
import type { User, CartItem, Cart, Product, StoreConfig, ProductConfig, Order, ShippingAddress } from '../types';

const API_URL = 'http://localhost:5000/api';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  
  // E-commerce state
  cart: Cart | null;
  products: ProductConfig[];
  stores: StoreConfig[];
  orders: Order[];
  currentOrder: Order | null;
  
  // 3D Environment state
  currentStore: string | null;
  isInsideStore: boolean;
  nearbyStore: string | null;
  nearbyProduct: string | null;
  selectedProduct: ProductConfig | null;

  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  
  // Async actions
  fetchProducts: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, selectedVariant?: any) => Promise<void>;
  updateCartItem: (productId: string, quantity: number, selectedVariant?: any) => Promise<void>;
  removeFromCart: (productId: string, color?: string, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Order actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<void>;
  
  setCurrentStore: (storeId: string | null) => void;
  setIsInsideStore: (isInside: boolean) => void;
  setNearbyStore: (storeId: string | null) => void;
  setNearbyProduct: (productId: string | null) => void;
  setSelectedProduct: (product: ProductConfig | null) => void;
  setStores: (stores: StoreConfig[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  cart: null,
  products: [],
  stores: [],
  orders: [],
  currentOrder: null,

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, token, user });
    get().fetchCart();
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, token: null, user: null, cart: null, orders: [], currentOrder: null });
  },
  setUser: (user) => set({ user }),
  
  fetchProducts: async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        const products = data.map((p: any) => ({ ...p, id: p._id }));
        set({ products });
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  },

  fetchCart: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const cart = await res.json();
        set({ cart });
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  },

  addToCart: async (productId, quantity, selectedVariant) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ productId, quantity, selectedVariant })
      });
      if (res.ok) {
        const cart = await res.json();
        set({ cart });
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Failed to add to cart', err);
      throw err;
    }
  },

  updateCartItem: async (productId, quantity, selectedVariant) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/cart/update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ productId, quantity, selectedVariant })
      });
      if (res.ok) {
        const cart = await res.json();
        set({ cart });
      }
    } catch (err) {
      console.error('Failed to update cart', err);
    }
  },

  removeFromCart: async (productId, color, size) => {
    const token = get().token;
    if (!token) return;
    let url = `${API_URL}/cart/remove/${productId}?`;
    if (color) url += `color=${color}&`;
    if (size) url += `size=${size}`;
    
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const cart = await res.json();
        set({ cart });
      }
    } catch (err) {
      console.error('Failed to remove from cart', err);
    }
  },

  clearCart: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        set({ cart: data.cart });
      }
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  },

  fetchOrders: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const orders = await res.json();
        set({ orders });
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  },

  fetchOrderById: async (orderId: string) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const currentOrder = await res.json();
        set({ currentOrder });
      }
    } catch (err) {
      console.error('Failed to fetch order details', err);
    }
  },

  createOrder: async (shippingAddress, paymentMethod) => {
    const token = get().token;
    if (!token) return null;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ shippingAddress, paymentMethod })
      });
      
      if (res.ok) {
        const order = await res.json();
        set({ cart: null, currentOrder: order });
        get().fetchProducts(); // Refresh products to update stock
        return order;
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (err: any) {
      console.error('Failed to create order:', err);
      throw err;
    }
  },

  cancelOrder: async (orderId: string) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        const orders = get().orders.map(o => o._id === orderId ? updatedOrder : o);
        set({ orders, currentOrder: updatedOrder });
        get().fetchProducts(); // Refresh products stock
      }
    } catch (err) {
      console.error('Failed to cancel order', err);
    }
  },
  
  currentStore: null,
  isInsideStore: false,
  nearbyStore: null,
  nearbyProduct: null,
  selectedProduct: null,
  
  setCurrentStore: (storeId) => set({ currentStore: storeId }),
  setIsInsideStore: (isInside) => set({ isInsideStore: isInside }),
  setNearbyStore: (storeId) => set({ nearbyStore: storeId }),
  setNearbyProduct: (productId) => set({ nearbyProduct: productId }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setStores: (stores) => set({ stores })
}));
