import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { User } from '../model/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const createUser = catchAsyncError(async (req, res) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
            if (err) return new Error(err.message);
            hashedPassword = hashedPassword.toString('hex');
            try {
                const user = await User.create({
                    ...req.body,
                    password: hashedPassword,
                    salt,
                });
                const token = jwt.sign(
                    { id: user.id, role: user.role },
                    process.env.SECRET_KEY
                );
                req.login(token, function (err) {
                    if (err) throw new Error(err.message);
                    return res.status(201).json(token);
                });
            } catch (err) {
                return res
                    .status(500)
                    .json({ success: false, message: err.message });
            }
        }
    );
});

export const loginUser = catchAsyncError(async (req, res, next) => {
    return res.status(201).json(req.user);
});

export const checkUser = catchAsyncError(async (req, res, next) => {
    return res.status(201).json(req.user);
});
