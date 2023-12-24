import { Router } from 'express';
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderByUser,
    updateOder,
} from '../controller/Order.js';

const router = Router();

router
    .post('/', createOrder)
    .get('/own', getOrderByUser)
    .get('/', getAllOrders)
    .delete('/:id', deleteOrder)
    .patch('/:id', updateOder);

export default router;
