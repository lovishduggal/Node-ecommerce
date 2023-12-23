import { ErrorHandler } from '../services/utils/errorHandler.js';
import passport from 'passport';

function isAuth(req, res, next) {
    return passport.authenticate('jwt');
}
export default isAuth;
