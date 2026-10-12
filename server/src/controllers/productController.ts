import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductsByStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      res.status(400).json({ message: 'Store ID is required' });
      return;
    }
    const products = await Product.find({ storeId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by store:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    if (!category) {
      res.status(400).json({ message: 'Category is required' });
      return;
    }
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
