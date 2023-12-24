import passport from 'passport';

function isAuth(req, res, next) {
    return passport.authenticate('jwt');
}
export default isAuth;
