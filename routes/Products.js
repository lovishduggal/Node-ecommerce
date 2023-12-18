import { Router } from 'express';
import { createProduct, getAllProducts } from '../controller/Product.js';
const router = Router();

router.post('/', createProduct).get('/', getAllProducts);

export default router;
