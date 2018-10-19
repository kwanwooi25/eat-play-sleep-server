/** Passport */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

/** Random ID Generator */
const randomId = require('random-id');
const length = 20;
const pattern = '0'; // generates Id only with numbers

/** Database */
const db = require('../database');

/** Utility */
const { onFail } = require('../utils/formatResponse');

/** Configs */
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}
const facebookConfig = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'email']
}
const kakaoConfig = {
  clientID: process.env.KAKAO_APP_ID,
  clientSecret: '',
  callbackURL: '/auth/kakao/callback'
}
const naverConfig = {
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: '/auth/naver/callback'
}

/**
 * find and return existing user,
 * create and return new user otherwise
 */
const findOrCreateUser = (accessToken, refreshToken, profile, done) => {
  const { provider, id } = profile;

  return db('users')
    .where(`${provider}_id`, '=', id)
    .then(user => {
      if (user.length) {
        // return user if exists
        return done(null, user[0]);
      } else {
        // create new user otherwise
        const newUser = {
          id: randomId(length, pattern),
          [`${provider}_id`]: id
        }

        db('users')
          .insert(newUser)
          .returning('*')
          .then(user => done(null, user[0]))
      }
    })
    .catch(error => res.json(onFail(error)));;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db('users')
    .where('id', '=', id)
    .then(user => {
      done(null, user[0]);
    });
});

passport.use(new GoogleStrategy(googleConfig, findOrCreateUser));
passport.use(new FacebookStrategy(facebookConfig, findOrCreateUser));
passport.use(new KakaoStrategy(kakaoConfig, findOrCreateUser));
passport.use(new NaverStrategy(naverConfig, findOrCreateUser));

module.exports = passport;