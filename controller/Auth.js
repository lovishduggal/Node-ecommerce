import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { User } from '../model/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const createUser = catchAsyncError(async (req, res) => {
    console.log(req);
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
                req.login(
                    { id: user.id, role: user.role, token },
                    function (err) {
                        if (err) throw new Error(err.message);
                        return res
                            .status(201)
                            .cookie('jwt', token, {
                                expires: new Date(Date.now() + 3600000),
                                httpOnly: true,
                            })
                            .json({ id: user.id, role: user.role });
                    }
                );
            } catch (err) {
                return res
                    .status(500)
                    .json({ success: false, message: err.message });
            }
        }
    );
});

export const loginUser = catchAsyncError(async (req, res, next) => {
    return res
        .status(201)
        .cookie('jwt', req.user.token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        })
        .json({ id: req.user.id, role: req.user.role });
});

export const checkAuth = catchAsyncError(async (req, res, next) => {
    if (!req.user) return res.status(401);
    return res.status(201).json({ id: req.user.id, role: req.user.role });
});
