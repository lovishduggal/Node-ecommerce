import { Router } from 'express';
import { checkUser, createUser, loginUser } from '../controller/Auth.js';
import passport from 'passport';

const router = Router();

router
    .post('/signup', createUser)
    .get('/check', passport.authenticate('jwt'), checkUser)
    .post('/login', passport.authenticate('local'), loginUser);

export default router;
