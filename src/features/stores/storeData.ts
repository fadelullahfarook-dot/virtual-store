import type { StoreConfig, ProductConfig } from '../../types';

export const INITIAL_STORES: Omit<StoreConfig, 'products'>[] = [
  {
    id: 'tech-gadgets',
    name: 'Tech Gadgets',
    category: 'electronics',
    position: [-12, 0, -20],
    rotation: [0, Math.PI / 2, 0],
    color: '#4361ee',
    size: [8, 10, 8],
    entrancePosition: [0, -5, 4.01]
  },
  {
    id: 'fashion-hub',
    name: 'Fashion Hub',
    category: 'fashion',
    position: [-12, 0, -40],
    rotation: [0, Math.PI / 2, 0],
    color: '#f72585',
    size: [8, 10, 8],
    entrancePosition: [0, -5, 4.01]
  },
  {
    id: 'sneaker-store',
    name: 'Sneaker Store',
    category: 'fashion',
    position: [-12, 0, -60],
    rotation: [0, Math.PI / 2, 0],
    color: '#3a0ca3',
    size: [8, 10, 8],
    entrancePosition: [0, -5, 4.01]
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    category: 'furniture',
    position: [12, 0, -30],
    rotation: [0, -Math.PI / 2, 0],
    color: '#4cc9f0',
    size: [8, 10, 8],
    entrancePosition: [0, -5, 4.01]
  },
  {
    id: 'bookstore',
    name: 'Bookstore',
    category: 'grocery',
    position: [12, 0, -50],
    rotation: [0, -Math.PI / 2, 0],
    color: '#7209b7',
    size: [8, 10, 8],
    entrancePosition: [0, -5, 4.01]
  }
];

export const buildStoresWithProducts = (products: ProductConfig[]): StoreConfig[] => {
  return INITIAL_STORES.map(store => ({
    ...store,
    products: products.filter(p => p.storeId === store.id)
  }));
};
