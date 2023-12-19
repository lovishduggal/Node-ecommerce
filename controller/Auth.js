import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { User } from '../model/User.js';
import { ErrorHandler } from '../services/utils/errorHandler.js';

export const createUser = catchAsyncError(async (req, res) => {
    const user = await User.create(req.body);
    return res.status(201).json(user);
});

export const loginUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne(
        { email: req.body.email },
        'id name email password'
    );
    if (!user) return next(new ErrorHandler('Invalid credentials', 401));

    //*  this is just temporary, we will use strong password
    if (!(user.password === req.body.password))
        return next(new ErrorHandler('Invalid credentials', 401));
    return res.status(201).json(user);
});
