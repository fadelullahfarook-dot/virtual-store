import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

const generateOrderNumber = () => {
  return `VS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      res.status(400).json({ message: 'Shipping address and payment method are required' });
      return;
    }

    const cart = await Cart.findOne({ userId: req.user?.id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    let calculatedSubtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId._id}`);
      }

      // Check stock
      let availableStock = product.stock;
      
      let additionalPrice = 0;
      if (item.selectedVariant && product.variants) {
        const variant = product.variants.find(
          v => v.color === item.selectedVariant?.color && v.size === item.selectedVariant?.size
        );
        if (variant) {
          availableStock = variant.stock;
          additionalPrice = variant.additionalPrice || 0;
        }
      }

      if (availableStock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemPrice = product.price + additionalPrice;
      const itemSubtotal = itemPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        price: itemPrice,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        subtotal: itemSubtotal
      });

      // Update product stock
      if (item.selectedVariant && product.variants) {
        const variantIndex = product.variants.findIndex(
          v => v.color === item.selectedVariant?.color && v.size === item.selectedVariant?.size
        );
        if (variantIndex > -1) {
          product.variants[variantIndex].stock -= item.quantity;
        }
      } else {
        product.stock -= item.quantity;
      }
      
      await product.save();
    }

    const deliveryFee = 100; // Fixed delivery fee for now
    const totalAmount = calculatedSubtotal + deliveryFee;

    const paymentStatus = paymentMethod === 'Test Online Payment' ? 'Paid' : 'Pending';
    const orderStatus = paymentMethod === 'Test Online Payment' ? 'Confirmed' : 'Pending';

    const order = new Order({
      userId: req.user?.id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();



    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message || 'Error creating order' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user?.id });
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user?.id });
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      res.status(400).json({ message: 'Cannot cancel an order that has been shipped or delivered' });
      return;
    }
    
    if (order.orderStatus === 'Cancelled') {
      res.status(400).json({ message: 'Order is already cancelled' });
      return;
    }

    // Revert stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (item.selectedVariant && product.variants) {
          const variantIndex = product.variants.findIndex(
            v => v.color === item.selectedVariant?.color && v.size === item.selectedVariant?.size
          );
          if (variantIndex > -1) {
            product.variants[variantIndex].stock += item.quantity;
          }
        } else {
          product.stock += item.quantity;
        }
        await product.save();
      }
    }

    order.orderStatus = 'Cancelled';
    await order.save();
    


    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
