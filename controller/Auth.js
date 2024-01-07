import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { User } from '../model/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendMail } from '../services/utils/sendEmail.js';
import { ErrorHandler } from '../services/utils/errorHandler.js';

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

export const logout = catchAsyncError(async (req, res, next) => {
    return res
        .status(200)
        .cookie('jwt', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        .json({ success: true, message: 'Successfully logout' });
});

export const checkAuth = catchAsyncError(async (req, res, next) => {
    if (!req.user) return res.status(401);
    return res.status(201).json({ id: req.user.id, role: req.user.role });
});

export const resetPasswordRequest = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return next(
            new ErrorHandler('User does not exit, check your email ', 400)
        );

    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    await user.save();

    const to = user.email;
    const resetPage = `http://localhost:3000/reset-password?token=${token}&email=${to}`;
    const subject = 'Password reset for Ecommerce';
    const html = `<p>Click <a href=${resetPage}>here</a> to Reset the Password</p>`;
    const response = await sendMail({ to, subject, html });
    return res.json(response);
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { email, password, token } = req.body;
    const user = await User.findOne({ email, resetPasswordToken: token });
    if (!user)
        return next(
            new ErrorHandler('User does not exit, check your email ', 400)
        );

    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
            if (err) return new Error(err.message);
            user.salt = salt;
            user.password = hashedPassword.toString('hex');
            user.resetPasswordToken = undefined;
            try {
                await user.save();
                const to = email;
                const subject = 'Password has reset successfully for Ecom';
                const html = `<p>Congrats, your password has reset successfully</p>`;
                const response = await sendMail({ to, subject, html });
                return res.json(response);
            } catch (err) {
                return res
                    .status(500)
                    .json({ success: false, message: err.message });
            }
        }
    );
});
