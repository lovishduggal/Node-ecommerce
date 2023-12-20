import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Order } from '../model/Order.js';

export const createOrder = catchAsyncError(async (req, res) => {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
});

export const getOrderByUser = catchAsyncError(async (req, res) => {
    const { user } = req.query;
    const orders = await Order.find({ user });
    return res.status(200).json(orders);
});

export const deleteOrder = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id, { new: true });
    return res.status(200).json(order);
});

export const updateOder = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true })
        .populate('user')
        .populate('product');
    return res.status(200).json(order);
});
