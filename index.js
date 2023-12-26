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
import session from 'express-session';
import passport from 'passport';
import { catchAsyncError } from './middleware/catchAsyncError.js';
import { User } from './model/User.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import isAuth from './middleware/isAuth.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { cookieExtractor } from './services/utils/cookieExt.js';
import stripe from 'stripe';

config();

const server = express();

//* Middlewares
server.use(express.static('build'));
server.use(
    cors({
        exposedHeaders: 'X-Total-Count',
    })
);
server.use(morgan('dev'));
server.use(express.json());
server.use(cookieParser());
server.use(express.raw({ type: 'application/json' }));

//* JWT Options:
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY;

//Passport and JWT middlewares:
server.use(
    session({
        secret: 'keyboard cat',
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
    })
);
server.use(passport.authenticate('session'));
passport.use(
    'local',
    new LocalStrategy(
        { usernameField: 'email' },
        catchAsyncError(async function (email, password, next) {
            const user = await User.findOne({ email });
            console.log(user);
            if (!user) return next(null, false);
            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                'sha256',
                async function (err, hashedPassword) {
                    if (err) return new Error(err.message);
                    if (
                        crypto.timingSafeEqual(
                            Buffer.from(user.password, 'hex'),
                            hashedPassword
                        )
                    ) {
                        const token = jwt.sign(
                            { id: user.id, role: user.role },
                            process.env.SECRET_KEY
                        );
                        return next(null, {
                            id: user.id,
                            role: user.role,
                            token,
                        });
                    } else next(null, false);
                }
            );
        })
    )
);
passport.use(
    'jwt',
    new JwtStrategy(
        opts,
        catchAsyncError(async function (jwt_payload, next) {
            const user = await User.findOne({ _id: jwt_payload.id });
            console.log('hii from JwtStrategy user', user);
            if (!user) return next(null, false);
            else {
                return next(null, user);
            }
        })
    )
);
passport.serializeUser(function (user, cb) {
    console.log('hii from serialized user', user);
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role, token: user.token });
    });
});
passport.deserializeUser(function (user, cb) {
    console.log('hii from deserializing user lovish', user);
    process.nextTick(function () {
        return cb(null, user);
    });
});

//* Routes
server.use('/products', isAuth(), productsRouter);
server.use('/brands', isAuth(), brandsRouter);
server.use('/categories', isAuth(), categoriesRouter);
server.use('/users', isAuth(), userRouter);
server.use('/auth', authRouter);
server.use('/cart', isAuth(), cartRouter);
server.use('/orders', isAuth(), ordersRouter);

//* Payments:
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripeInstance = stripe(
    'sk_test_51ORQNzSGXWph5zOVhHb8Rdrz7DXgvSdwewdGYey40ZUOZ0xA96mHmpg0oP45v1Peisfo38aX5c6WSNOCH2hHqPgt006dlQ34oz'
);
const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

server.post('/create-payment-intent', async (req, res) => {
    const { totalAmount } = req.body;
    console.log(totalAmount);
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: totalAmount * 100,
        currency: 'inr',
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return res.json({
        clientSecret: paymentIntent.client_secret,
    });
});

//* Webhook:
// This is your Stripe CLI webhook secret for testing your endpoint locally.
//* We will capture actual order after deploying out server live on public URL
const endpointSecret =
    'whsec_5655ee8568c9d0fa9a5033900a4aff9b826d4cb7d3ba1d772dd7bbd36ae594b7';

server.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (request, response) => {
        const sig = request.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                sig,
                endpointSecret
            );
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send();
    }
);
//* Establish the db connection
main().catch((err) => console.log(err));

//* Error handler middleware
server.use(ErrorMiddleware);

server.listen(8080, () => {
    console.log('listening on port');
});
