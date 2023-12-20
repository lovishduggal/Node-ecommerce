import { Router } from 'express';
import {
    addToCart,
    deleteFromCart,
    getCartByUser,
    updateCart,
} from '../controller/Cart.js';

const router = Router();

router
    .post('/', addToCart)
    .get('/', getCartByUser)
    .delete('/:id', deleteFromCart)
    .patch('/:id', updateCart);

export default router;
