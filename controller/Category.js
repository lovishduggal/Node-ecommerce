import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Category } from '../model/Category.js';

export const createCategory = catchAsyncError(async (req, res) => {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
});
export const getAllCategories = catchAsyncError(async (req, res) => {
    const categories = await Category.find({});
    return res.status(200).json(categories);
});
