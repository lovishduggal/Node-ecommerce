import { Router } from 'express';
import {
    checkAuth,
    createUser,
    loginUser,
    resetPassword,
    resetPasswordRequest,
} from '../controller/Auth.js';
import passport from 'passport';

const router = Router();

router
    .post('/signup', createUser)
    .get('/check', passport.authenticate('jwt'), checkAuth)
    .post('/login', passport.authenticate('local'), loginUser)
    .post('/reset-password-request', resetPasswordRequest)
    .post('/reset-password', resetPassword);

export default router;
