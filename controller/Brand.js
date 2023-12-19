import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Brand } from '../model/Brand.js';

export const createBrand = catchAsyncError(async (req, res) => {
    const brand = await Brand.create(req.body);
    return res.status(201).json(brand);
});
export const getAllBrands = catchAsyncError(async (req, res) => {
    const brands = await Brand.find({});
    return res.status(200).json(brands);
});
