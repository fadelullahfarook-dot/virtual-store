import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductsByStore,
  getProductsByCategory
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/store/:storeId', getProductsByStore);
router.get('/category/:category', getProductsByCategory);

export default router;
