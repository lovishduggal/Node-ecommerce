import { Router } from 'express';
import { createBrand, getAllBrands } from '../controller/Brand.js';

const router = Router();

router.get('/', getAllBrands).post('/', createBrand);

export default router;
