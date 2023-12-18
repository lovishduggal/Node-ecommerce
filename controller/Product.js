import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Product } from '../model/Product.js';

export const createProduct = catchAsyncError(async (req, res) => {
    const product = await Product.create(req.body);
    return res.status(201).json({
        message: 'success',
        product,
    });
});

export const getAllProducts = catchAsyncError(async (req, res) => {
    //* filter = {"category": ["smartphone", "laptops"]};
    //* sort = {_sort: "price", _order="desc"}
    //* pagination = {_page:1, _limit=10} => _page=1&_limit=10
    //TODO: We have to try with multiple category and brands after change in front-end
    let query = Product.find({});
    if (req.query.category) {
        query = query.find({ category: req.query.category });
    }
    if (req.query.brand) {
        query = query.find({ brand: req.query.brand });
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
    const totalCount = await Product.find({}).countDocuments();
    return res.status(200).set('X-Total-Count', totalCount).json({
        message: 'success',
        products,
    });
});
