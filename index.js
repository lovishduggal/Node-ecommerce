import { config } from 'dotenv';
import express from 'express';
import { main } from './services/config/db.js';
import productsRouter from './routes/Products.js';
import brandsRouter from './routes/Brands.js';
import categoriesRouter from './routes/Categories.js';
import userRouter from './routes/User.js';
import authRouter from './routes/Auth.js';
import cartRouter from './routes/Cart.js';
import ordersRouter from './routes/Order.js';
import { ErrorMiddleware } from './middleware/error.js';
import cors from 'cors';
import morgan from 'morgan';
config();

const server = express();

//* Middlewares
server.use(
    cors({
        exposedHeaders: 'X-Total-Count',
    })
);
server.use(morgan('dev'));
server.use(express.json());

//* Routes
server.use('/products', productsRouter);
server.use('/brands', brandsRouter);
server.use('/categories', categoriesRouter);
server.use('/users', userRouter);
server.use('/auth', authRouter);
server.use('/cart', cartRouter);
server.use('/orders', ordersRouter);

//* Establish the db connection
main().catch((err) => console.log(err));

//* Error handler middleware
server.use(ErrorMiddleware);

server.listen(8080, () => {
    console.log('listening on port');
});
