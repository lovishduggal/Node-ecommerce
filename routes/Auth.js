import { Router } from 'express';
import { checkAuth, createUser, loginUser } from '../controller/Auth.js';
import passport from 'passport';

const router = Router();

router
    .post('/signup', createUser)
    .get('/check', passport.authenticate('jwt'), checkAuth)
    .post('/login', passport.authenticate('local'), loginUser);

export default router;
