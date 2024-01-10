import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Product } from '../model/Product.js';
import { ErrorHandler } from '../services/utils/errorHandler.js';

export const createProduct = catchAsyncError(async (req, res) => {
    const product = await Product.create(req.body);
    product.discountPrice = Math.round(
        product.price * (1 - product.discountPercentage / 100)
    );
    await product.save();
    return res.status(201).json(product);
});

export const getAllProducts = catchAsyncError(async (req, res) => {
    //* filter = {"category": ["smartphone", "laptops"]};
    //* sort = {_sort: "price", _order="desc"}
    //* pagination = {_page:1, _limit=10} => _page=1&_limit=10

    let condition = {};
    if (!req.query.admin) {
        condition.deleted = { $ne: true };
    }
    let query = Product.find(condition);
    if (req.query.category) {
        query = query.find({
            category: { $in: req.query.category.split(',') },
        });
    }
    if (req.query.brand) {
        query = query.find({ brand: { $in: req.query.brand.split(',') } });
    }
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
    const products = await query.exec();
    const totalCount = await Product.find(condition).countDocuments();
    return res.status(200).set('X-Total-Count', totalCount).json(products);
});

export const getProductById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    return res.status(200).json(product);
});

export const updateProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
        id,
        { ...req.body, deleted: req.body.deleted ? true : false },
        {
            new: true,
        }
    );
    if (!product)
        return next(new ErrorHandler('Product not found or updated', 404));
    product.discountPrice = Math.round(
        product.price * (1 - product.discountPercentage / 100)
    );
    await product.save();
    return res.status(200).json(product);
});
