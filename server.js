/** Configure Environment Variables */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

/** Dependencies */
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

/** Initalize App */
const app = express();

/** Middlewares */
// Enable CORS
app.use(cors());
// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// use Session
app.use(session({
  secret: process.env.COOKIE_KEY,
  resave: true,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  }
}));
// Passport
require('./services/passport')(app, passport);

/** Routes */
app.get('/', (req, res) => {
  res.send("This is EatPlaySleep Server");
});
require('./routes/auth')(app);
require('./routes/user')(app);
require('./routes/baby')(app);
require('./routes/activity')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT);