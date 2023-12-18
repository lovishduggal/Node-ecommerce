import { config } from 'dotenv';
import express from 'express';
import { main } from './services/config/db.js';
import productsRouter from './routes/Products.js';
import brandsRouter from './routes/Brands.js';
import categoriesRouter from './routes/Categories.js';
import { ErrorMiddleware } from './middleware/error.js';
config();

const server = express();

//* Middlewares
server.use(express.json());

//* Routes
server.use('/api/v1/products', productsRouter);
server.use('/api/v1/brands', brandsRouter);
server.use('/api/v1/categories', categoriesRouter);

//* Establish the db connection
main().catch((err) => console.log(err));

//* Error handler middleware
server.use(ErrorMiddleware);

server.listen(8080, () => {
    console.log('listening on port');
});
