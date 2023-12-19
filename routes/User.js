import { Router } from 'express';
import { getUserById, updateUser } from '../controller/User.js';

const router = Router();

router.get('/:id', getUserById).patch('/:id', updateUser);

export default router;
