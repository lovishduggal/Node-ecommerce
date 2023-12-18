import { Router } from 'express';
import { getAllCategories } from '../controller/Category.js';

const router = Router();

router.get('/', getAllCategories);

export default router;
