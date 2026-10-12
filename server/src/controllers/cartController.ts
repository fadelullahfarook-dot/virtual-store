import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Cart, { ICartItem } from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    let cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: new mongoose.Types.ObjectId(userId), items: [], subtotal: 0 });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getCartItemProductIdString = (item: ICartItem): string => {
  if (item.productId instanceof mongoose.Types.ObjectId) {
    return item.productId.toString();
  }
  return item.productId._id.toString();
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { productId, quantity, selectedVariant } = req.body;
    
    if (!productId || typeof quantity !== 'number') {
      res.status(400).json({ message: 'Product ID and quantity are required' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ message: 'Not enough stock available' });
      return;
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId: new mongoose.Types.ObjectId(userId), items: [], subtotal: 0 });
    }

    // Determine variant string for matching
    const variantMatch = (item: ICartItem) => {
      if (!selectedVariant && !item.selectedVariant) return true;
      if (!selectedVariant || !item.selectedVariant) return false;
      return item.selectedVariant.color === selectedVariant.color && 
             item.selectedVariant.size === selectedVariant.size;
    };

    const existingItemIndex = cart.items.findIndex(item => {
      const itemProdId = getCartItemProductIdString(item);
      return itemProdId === productId && variantMatch(item);
    });

    let price = product.price;
    if (selectedVariant && product.variants) {
      const variant = product.variants.find(v => v.color === selectedVariant.color && v.size === selectedVariant.size);
      if (variant && variant.additionalPrice) {
        price += variant.additionalPrice;
      }
    }

    if (existingItemIndex > -1) {
      const existingItem = cart.items[existingItemIndex];
      if (existingItem) {
        existingItem.quantity += quantity;
      }
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
        selectedVariant,
        price
      });
    }

    await cart.save();
    
    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(populatedCart);
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { productId, quantity, selectedVariant } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const variantMatch = (item: ICartItem) => {
      if (!selectedVariant && !item.selectedVariant) return true;
      if (!selectedVariant || !item.selectedVariant) return false;
      return item.selectedVariant.color === selectedVariant.color && 
             item.selectedVariant.size === selectedVariant.size;
    };

    const itemIndex = cart.items.findIndex(item => {
      const itemProdId = getCartItemProductIdString(item);
      return itemProdId === productId && variantMatch(item);
    });

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        const targetItem = cart.items[itemIndex];
        if (targetItem) {
          targetItem.quantity = quantity;
        }
      }
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.productId');
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { productId } = req.params;
    const { color, size } = req.query;

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const variantMatch = (item: ICartItem) => {
      if (!color && !size && !item.selectedVariant) return true;
      if (item.selectedVariant) {
        return item.selectedVariant.color === color && item.selectedVariant.size === size;
      }
      return false;
    };

    cart.items = cart.items.filter(item => {
      const itemProdId = getCartItemProductIdString(item);
      return !(itemProdId === productId && variantMatch(item));
    });

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
