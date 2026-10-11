import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
