const jwt = require('jsonwebtoken');
const passport = require('passport');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { onSuccess } = require('../utils/formatResponse');

const redirectUser = (req, res) => {
  const token = jwt.sign(
    { id: req.user.id },
    process.env.JWT_SECRET,
    { expiresIn: 24 * 60 * 60 },
  );

  res.redirect(`${req.headers.referer}?token=${token}`);
}

const sendUserInfo = (req, res) => res.json(onSuccess(req.user));

module.exports = app => {
  
  /** Google */
  app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }));
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    redirectUser
  );

  /** Facebook */
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    redirectUser
  );

  /** Kakao */
  app.get('/auth/kakao', passport.authenticate('kakao'));
  app.get(
    '/auth/kakao/callback',
    passport.authenticate('kakao', { session: false }),
    redirectUser
  );

  /** Naver */
  app.get('/auth/naver', passport.authenticate('naver'));
  app.get(
    '/auth/naver/callback',
    passport.authenticate('naver', { session: false }),
    redirectUser
  );

  /** Get current user info */
  app.get('/auth/current_user', isAuthenticated, sendUserInfo);
}