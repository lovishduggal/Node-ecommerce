import { Router } from 'express';
import { getAllBrands } from '../controller/Brand.js';

const router = Router();

router.get('/', getAllBrands);

export default router;
