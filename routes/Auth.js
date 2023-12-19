import { Router } from 'express';
import { createUser, loginUser } from '../controller/Auth.js';

const router = Router();

router.post('/signup', createUser).post('/login', loginUser);

export default router;
