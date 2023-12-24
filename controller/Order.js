import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Order } from '../model/Order.js';

export const createOrder = catchAsyncError(async (req, res) => {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
});

export const getOrderByUser = catchAsyncError(async (req, res) => {
    const { id } = req.user;
    console.log(id);
    const orders = await Order.find({ user: id });
    return res.status(200).json(orders);
});

export const deleteOrder = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id, { new: true });
    return res.status(200).json(order);
});

export const updateOder = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    return res.status(200).json(order);
});

export const getAllOrders = catchAsyncError(async (req, res) => {
    //* sort = {_sort: "price", _order="desc"}
    //* pagination = {_page:1, _limit=10} => _page=1&_limit=10
    let query = Order.find({ deleted: { $ne: true } });
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
    //TODO: How to get sort on discounted Price not on Actual Price
    const orders = await query.exec();
    const totalCount = await Order.find({
        deleted: { $ne: true },
    }).countDocuments();
    return res.status(200).set('X-Total-Count', totalCount).json(orders);
});
