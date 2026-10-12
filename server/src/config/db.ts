
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is missing from environment variables');
    }

    if (
      mongoURI.includes('YOUR_USERNAME') ||
      mongoURI.includes('YOUR_PASSWORD')
    ) {
      throw new Error('MONGO_URI still contains placeholder credentials');
    }

    await mongoose.connect(mongoURI);

    console.log('MongoDB Atlas Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
