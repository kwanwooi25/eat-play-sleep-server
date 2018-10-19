/** Configure Environment Variables */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

/** Dependencies */
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');

/** Initalize App */
const app = express();

/** Middlewares */
// Enable CORS
app.use(cors());
// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// use Session
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY]
  })
);
// Passport
require('./services/passport');
app.use(passport.initialize());
app.use(passport.session());

/** Routes */
app.get('/', (req, res) => {
  res.send("This is EatPlaySleep Server");
});
require('./routes/auth')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);