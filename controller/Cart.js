import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Cart } from '../model/Cart.js';

export const addToCart = catchAsyncError(async (req, res) => {
    console.log(req);
    const { id } = req.user;
    const cart = await (
        await Cart.create({ ...req.body, user: id })
    ).populate('product');
    return res.status(201).json(cart);
});

export const getCartByUser = catchAsyncError(async (req, res) => {
    const { id } = req.user;
    const cartItems = await Cart.find({ user: id })
        .populate('user')
        .populate('product');
    return res.status(200).json(cartItems);
});

export const deleteFromCart = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id, { new: true });
    return res.status(200).json(cart);
});

export const updateCart = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true })
        .populate('user')
        .populate('product');
    return res.status(200).json(cart);
});
