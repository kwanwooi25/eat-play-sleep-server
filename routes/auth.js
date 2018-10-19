const passport = require('../services/passport');
const { onSuccess } = require('../utils/formatResponse');

const sendUserInfo = (req, res) => { res.json(onSuccess(req.user)) };

module.exports = app => {
  
  /** Google */
  app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }));
  app.get('/auth/google/callback', passport.authenticate('google'), sendUserInfo);

  /** Facebook */
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook'), sendUserInfo);

  /** Kakao */
  app.get('/auth/kakao', passport.authenticate('kakao'));
  app.get('/auth/kakao/callback', passport.authenticate('kakao'), sendUserInfo);

  /** Naver */
  app.get('/auth/naver', passport.authenticate('naver'));
  app.get('/auth/naver/callback', passport.authenticate('naver'), sendUserInfo);
  
  /** Get current user info */
  app.get('/auth/current_user', sendUserInfo);

  /** Logout */
  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.json(onSuccess(req.user));
  });
}