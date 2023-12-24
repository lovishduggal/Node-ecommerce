import { Router } from 'express';
import { getUserById, updateUser } from '../controller/User.js';

const router = Router();

router.get('/own', getUserById).patch('/:id', updateUser);

export default router;
