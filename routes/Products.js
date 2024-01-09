import { Router } from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from '../controller/Product.js';
import { Product } from '../model/Product.js';
const router = Router();

router
    .post('/', createProduct)
    .get('/', getAllProducts)
    .get('/:id', getProductById)
    .patch('/:id', updateProduct);

export default router;
