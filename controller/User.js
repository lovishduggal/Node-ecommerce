import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { User } from '../model/User.js';
import { ErrorHandler } from '../services/utils/errorHandler.js';

export const getUserById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id, 'name email addresses id');
    if (!user) return next(new ErrorHandler('User not found', 404));
    return res.status(201).json(user);
});

export const updateUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return next(new ErrorHandler('User not found', 404));
    return res.status(201).json(user);
});
