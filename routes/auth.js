const passport = require('../services/passport');
const { onSuccess, onFail } = require('../utils/formatResponse');

const redirectUser = (req, res) => {
  res.redirect(`${process.env.HOST}`);
};

module.exports = app => {
  
  /** Google */
  app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }));
  app.get('/auth/google/callback', passport.authenticate('google'), redirectUser);

  /** Facebook */
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook'), redirectUser);

  /** Kakao */
  app.get('/auth/kakao', passport.authenticate('kakao'));
  app.get('/auth/kakao/callback', passport.authenticate('kakao'), redirectUser);

  /** Naver */
  app.get('/auth/naver', passport.authenticate('naver'));
  app.get('/auth/naver/callback', passport.authenticate('naver'), redirectUser);
  
  /** Get current user info */
  app.get('/auth/current_user', (req, res) => {
    if (req.user) res.json(onSuccess(req.user))
    else res.json(onFail('user not logged in'))
  });

  /** Logout */
  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
}