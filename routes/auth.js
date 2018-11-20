const router = require('express').Router();
const passport = require('passport');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { redirectUser, sendUserInfo } = require('../controllers/auth');

/** Google */
router.get('/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  redirectUser
);

/** Facebook */
router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  redirectUser
);

/** Kakao */
router.get('/kakao', passport.authenticate('kakao'));
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', { session: false }),
  redirectUser
);

/** Naver */
router.get('/naver', passport.authenticate('naver'));
router.get(
  '/naver/callback',
  passport.authenticate('naver', { session: false }),
  redirectUser
);

/** Get current user info */
router.get('/current_user', isAuthenticated, sendUserInfo);

module.exports = router;