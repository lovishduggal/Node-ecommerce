import { Router } from 'express';
import {
    createOrder,
    deleteOrder,
    getOrderByUser,
    updateOder,
} from '../controller/Order.js';

const router = Router();

router
    .post('/', createOrder)
    .get('/', getOrderByUser)
    .delete('/:id', deleteOrder)
    .patch('/:id', updateOder);

export default router;
