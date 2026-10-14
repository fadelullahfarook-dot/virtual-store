import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import connectDB from './config/db';

dotenv.config();

const allProducts = [
  // SHOP 1: TECH GADGETS
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269541e"),
    name: 'Smartphone Pro',
    description: 'Latest high-end smartphone with OLED display and advanced camera.',
    category: 'electronics',
    company: 'TechCorp',
    storeId: 'tech-gadgets',
    price: 899,
    imageUrl: '/images/smartphone.jpg',
    stock: 50,
    variants: [
      { color: 'Midnight Black', additionalPrice: 0, stock: 25 },
      { color: 'Titanium Silver', additionalPrice: 20, stock: 25 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695441"),
    name: 'Smart Watch Pro',
    description: 'Advanced health monitoring smartwatch with AMOLED touch display.',
    category: 'electronics',
    company: 'TechCorp',
    storeId: 'tech-gadgets',
    price: 199,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    stock: 40,
    variants: [
      { color: 'Silver', additionalPrice: 0, stock: 20 },
      { color: 'Space Gray', additionalPrice: 0, stock: 20 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695442"),
    name: 'Tablet Air 11',
    description: 'High performance 11-inch tablet with stylus support.',
    category: 'electronics',
    company: 'TechCorp',
    storeId: 'tech-gadgets',
    price: 449,
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80',
    stock: 35,
    variants: [
      { color: 'Space Gray', additionalPrice: 0, stock: 20 },
      { color: 'Starlight', additionalPrice: 0, stock: 15 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695421"),
    name: 'Laptop Ultra',
    description: 'Thin and light powerful laptop for professionals.',
    category: 'electronics',
    company: 'CompuGeni',
    storeId: 'tech-gadgets',
    price: 1299,
    imageUrl: '/images/laptop.jpg',
    stock: 30,
    variants: [
      { color: 'Space Gray', additionalPrice: 0, stock: 15 },
      { color: 'Silver', additionalPrice: 0, stock: 15 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695443"),
    name: 'ANC Headphones',
    description: 'Premium wireless over-ear noise-cancelling headphones.',
    category: 'electronics',
    company: 'SoundWave',
    storeId: 'tech-gadgets',
    price: 149,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    stock: 45,
    variants: [
      { color: 'Matte Black', additionalPrice: 0, stock: 25 },
      { color: 'Arctic White', additionalPrice: 0, stock: 20 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695444"),
    name: '4K Display 27',
    description: '27-inch 4K IPS display with 144Hz refresh rate.',
    category: 'electronics',
    company: 'ViewPro',
    storeId: 'tech-gadgets',
    price: 399,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    stock: 25,
    variants: [
      { color: 'Black', additionalPrice: 0, stock: 25 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695445"),
    name: 'Bass Speaker',
    description: 'Waterproof portable bluetooth speaker with 24h battery.',
    category: 'electronics',
    company: 'SoundWave',
    storeId: 'tech-gadgets',
    price: 89,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    stock: 60,
    variants: [
      { color: 'Midnight Black', additionalPrice: 0, stock: 30 },
      { color: 'Ocean Blue', additionalPrice: 0, stock: 30 }
    ]
  },

  // SHOP 2: FASHION HUB
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695424"),
    name: 'Summer T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear.',
    category: 'fashion',
    company: 'CottonBreeze',
    storeId: 'fashion-hub',
    price: 29,
    imageUrl: '/images/tshirt.jpg',
    stock: 100,
    variants: [
      { color: 'White', size: 'M', additionalPrice: 0, stock: 50 },
      { color: 'Black', size: 'L', additionalPrice: 0, stock: 50 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695446"),
    name: 'Denim Jacket',
    description: 'Classic rugged denim trucker jacket with custom metal buttons.',
    category: 'fashion',
    company: 'DenimWorks',
    storeId: 'fashion-hub',
    price: 89,
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80',
    stock: 45,
    variants: [
      { color: 'Vintage Blue', size: 'M', additionalPrice: 0, stock: 25 },
      { color: 'Vintage Blue', size: 'L', additionalPrice: 0, stock: 20 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695447"),
    name: 'Knit Hoodie',
    description: 'Ultra-soft fleece hoodie designed for comfort and everyday wear.',
    category: 'fashion',
    company: 'UrbanStyle',
    storeId: 'fashion-hub',
    price: 59,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    stock: 55,
    variants: [
      { color: 'Heather Gray', size: 'M', additionalPrice: 0, stock: 30 },
      { color: 'Charcoal', size: 'L', additionalPrice: 0, stock: 25 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695429"),
    name: 'Designer Jeans',
    description: 'Premium denim jeans with a perfect fit.',
    category: 'fashion',
    company: 'DenimWorks',
    storeId: 'fashion-hub',
    price: 79,
    imageUrl: '/images/jeans.jpg',
    stock: 80,
    variants: [
      { color: 'Blue', size: '32', additionalPrice: 0, stock: 40 },
      { color: 'Black', size: '32', additionalPrice: 0, stock: 40 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695448"),
    name: 'Formal Blazer',
    description: 'Tailored Italian wool blend formal blazer for elegant occasions.',
    category: 'fashion',
    company: 'MilanoFit',
    storeId: 'fashion-hub',
    price: 149,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80',
    stock: 30,
    variants: [
      { color: 'Navy', size: '40R', additionalPrice: 0, stock: 15 },
      { color: 'Charcoal', size: '42R', additionalPrice: 0, stock: 15 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695449"),
    name: 'Wool Sweater',
    description: 'Warm knitted merino wool crewneck sweater.',
    category: 'fashion',
    company: 'CottonBreeze',
    storeId: 'fashion-hub',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80',
    stock: 40,
    variants: [
      { color: 'Camel', size: 'M', additionalPrice: 0, stock: 20 },
      { color: 'Cream', size: 'L', additionalPrice: 0, stock: 20 }
    ]
  },

  // SHOP 3: SNEAKER STREET
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269542d"),
    name: 'Classic Sneakers',
    description: 'Everyday classic sneakers for comfort and style.',
    category: 'fashion',
    company: 'StepRight',
    storeId: 'sneaker-store',
    price: 119,
    imageUrl: '/images/sneakers.jpg',
    stock: 60,
    variants: [
      { color: 'White', size: '9', additionalPrice: 0, stock: 30 },
      { color: 'Black', size: '10', additionalPrice: 0, stock: 30 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269544a"),
    name: 'Running Shoes',
    description: 'Responsive air-cushioned marathon running shoes.',
    category: 'fashion',
    company: 'StepRight',
    storeId: 'sneaker-store',
    price: 135,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    stock: 50,
    variants: [
      { color: 'Crimson Red', size: '9', additionalPrice: 0, stock: 25 },
      { color: 'Volt Green', size: '10', additionalPrice: 0, stock: 25 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269544b"),
    name: 'High-Top Kicks',
    description: 'Premium leather high-top basketball streetwear sneakers.',
    category: 'fashion',
    company: 'UrbanKicks',
    storeId: 'sneaker-store',
    price: 159,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&q=80',
    stock: 35,
    variants: [
      { color: 'Retro White/Black', size: '10', additionalPrice: 0, stock: 20 },
      { color: 'Bred Edition', size: '11', additionalPrice: 0, stock: 15 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269544c"),
    name: 'Retro Trainers',
    description: 'Vintage 90s inspired suede running trainers with foam midsole.',
    category: 'fashion',
    company: 'RetroStep',
    storeId: 'sneaker-store',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    stock: 45,
    variants: [
      { color: 'Pastel Blue', size: '9', additionalPrice: 0, stock: 25 },
      { color: 'Pastel Pink', size: '10', additionalPrice: 0, stock: 20 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269544d"),
    name: 'Slip-On Loafers',
    description: 'Handcrafted leather slip-on penny loafers for smart casual wear.',
    category: 'fashion',
    company: 'MilanoFit',
    storeId: 'sneaker-store',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80',
    stock: 40,
    variants: [
      { color: 'Cognac Brown', size: '9', additionalPrice: 0, stock: 20 },
      { color: 'Obsidian Black', size: '10', additionalPrice: 0, stock: 20 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269544e"),
    name: 'Canvas Lows',
    description: 'Timeless vulcanized low-cut canvas daily sneakers.',
    category: 'fashion',
    company: 'StepRight',
    storeId: 'sneaker-store',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80',
    stock: 65,
    variants: [
      { color: 'Off-White', size: '9', additionalPrice: 0, stock: 35 },
      { color: 'Navy', size: '10', additionalPrice: 0, stock: 30 }
    ]
  },

  // SHOP 4: ACCESSORIES & LIVING
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695431"),
    name: 'Modern Sofa',
    description: 'Comfortable 3-seater sofa perfect for your living room.',
    category: 'furniture',
    company: 'HomeComfort',
    storeId: 'home-decor',
    price: 499,
    imageUrl: '/images/sofa.jpg',
    stock: 15,
    variants: [
      { color: 'Charcoal Gray', additionalPrice: 0, stock: 8 },
      { color: 'Nordic Navy', additionalPrice: 0, stock: 7 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d717269544f"),
    name: 'Minimalist Lamp',
    description: 'Architectural matte black adjustable LED reading desk lamp.',
    category: 'furniture',
    company: 'LumiArt',
    storeId: 'home-decor',
    price: 79,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
    stock: 50,
    variants: [
      { color: 'Matte Black', additionalPrice: 0, stock: 25 },
      { color: 'Brushed Brass', additionalPrice: 10, stock: 25 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695450"),
    name: 'Ceramic Vase',
    description: 'Hand-glazed minimalist ceramic home decor tabletop vase.',
    category: 'furniture',
    company: 'EarthCraft',
    storeId: 'home-decor',
    price: 39,
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500&q=80',
    stock: 60,
    variants: [
      { color: 'Terracotta', additionalPrice: 0, stock: 30 },
      { color: 'Matte Sand', additionalPrice: 0, stock: 30 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695434"),
    name: 'Bestseller Novel',
    description: 'The latest fiction bestseller paperback novel.',
    category: 'grocery',
    company: 'PageTurner Press',
    storeId: 'bookstore',
    price: 19,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
    stock: 120,
    variants: []
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695451"),
    name: 'Aviator Sunglasses',
    description: 'Polarized UV400 classic gold-frame aviator sunglasses.',
    category: 'fashion',
    company: 'SunStyle',
    storeId: 'bookstore',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
    stock: 50,
    variants: [
      { color: 'Gold / Dark Green', additionalPrice: 0, stock: 25 },
      { color: 'Silver / Mirror Blue', additionalPrice: 0, stock: 25 }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId("6accf74b6e9c4d7172695452"),
    name: 'Leather Wallet',
    description: 'Genuine full-grain leather bifold wallet with RFID blocking.',
    category: 'fashion',
    company: 'ArtisanGoods',
    storeId: 'bookstore',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    stock: 70,
    variants: [
      { color: 'Espresso Brown', additionalPrice: 0, stock: 35 },
      { color: 'Onyx Black', additionalPrice: 0, stock: 35 }
    ]
  }
];

const seedAll = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas');

    for (const prod of allProducts) {
      await Product.findByIdAndUpdate(prod._id, prod, { upsert: true, new: true, setDefaultsOnInsert: true });
    }

    console.log(`Successfully upserted all ${allProducts.length} products into MongoDB Atlas!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding all products:', err);
    process.exit(1);
  }
};

seedAll();
