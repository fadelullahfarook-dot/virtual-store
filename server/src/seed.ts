import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import connectDB from './config/db';

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany(); // Clear existing products

    const products = [
      {
        name: 'Smartphone Pro',
        description: 'Latest high-end smartphone with OLED display and advanced camera.',
        category: 'electronics',
        company: 'TechCorp',
        storeId: 'tech-gadgets',
        price: 899,
        imageUrl: '/images/smartphone.jpg',
        stock: 50,
        variants: [
          { color: 'Black', stock: 25 },
          { color: 'Silver', stock: 25 }
        ],
        position: [-2, 0.5, 0],
        displayType: 'table'
      },
      {
        name: 'Laptop Ultra',
        description: 'Thin and light powerful laptop for professionals.',
        category: 'electronics',
        company: 'CompuGeni',
        storeId: 'tech-gadgets',
        price: 1299,
        imageUrl: '/images/laptop.jpg',
        stock: 30,
        variants: [
          { color: 'Space Gray', stock: 15 },
          { color: 'Silver', stock: 15 }
        ],
        position: [2, 0.5, 0],
        displayType: 'table'
      },
      {
        name: 'Summer T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear.',
        category: 'fashion',
        company: 'CottonBreeze',
        storeId: 'fashion-hub',
        price: 29,
        imageUrl: '/images/tshirt.jpg',
        stock: 100,
        variants: [
          { color: 'White', size: 'S', stock: 20 },
          { color: 'White', size: 'M', stock: 30 },
          { color: 'White', size: 'L', stock: 20 },
          { color: 'Black', size: 'M', stock: 30 }
        ],
        position: [-2, 0, -2],
        displayType: 'rack'
      },
      {
        name: 'Designer Jeans',
        description: 'Premium denim jeans with a perfect fit.',
        category: 'fashion',
        company: 'DenimWorks',
        storeId: 'fashion-hub',
        price: 79,
        imageUrl: '/images/jeans.jpg',
        stock: 80,
        variants: [
          { color: 'Blue', size: '30', stock: 20 },
          { color: 'Blue', size: '32', stock: 30 },
          { color: 'Black', size: '32', stock: 30 }
        ],
        position: [2, 0, -2],
        displayType: 'shelf'
      },
      {
        name: 'Classic Sneakers',
        description: 'Everyday classic sneakers for comfort and style.',
        category: 'fashion',
        company: 'StepRight',
        storeId: 'sneaker-store',
        price: 99,
        imageUrl: '/images/sneakers.jpg',
        stock: 60,
        variants: [
          { color: 'White', size: '9', stock: 20 },
          { color: 'White', size: '10', stock: 20 },
          { color: 'Black', size: '10', stock: 20 }
        ],
        position: [0, 0, -2],
        displayType: 'rack'
      },
      {
        name: 'Modern Sofa',
        description: 'Comfortable 3-seater sofa perfect for your living room.',
        category: 'furniture',
        company: 'HomeComfort',
        storeId: 'home-decor',
        price: 599,
        imageUrl: '/images/sofa.jpg',
        stock: 10,
        variants: [
          { color: 'Gray', stock: 5 },
          { color: 'Navy', stock: 5 }
        ],
        position: [0, -4, -2],
        displayType: 'floor'
      },
      {
        name: 'Bestseller Novel',
        description: 'The latest fiction bestseller.',
        category: 'grocery', // Reusing category from bookstores for simplicity
        company: 'PageTurner Press',
        storeId: 'bookstore',
        price: 15,
        imageUrl: 'https://placehold.co/400x400/png?text=Novel',
        stock: 200,
        variants: [],
        position: [0, 0, -2],
        displayType: 'shelf'
      }
    ];

    await Product.insertMany(products);
    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedProducts();
