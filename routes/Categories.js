import { Router } from 'express';
import { createCategory, getAllCategories } from '../controller/Category.js';

const router = Router();

router.get('/', getAllCategories).post('/', createCategory);

export default router;
