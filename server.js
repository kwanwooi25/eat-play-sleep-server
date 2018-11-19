/** Configure Environment Variables */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

/** Dependencies */
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
// Passport
app.use(passport.initialize());
require('./services/passport');

/** Routes */
app.get('/', (req, res) => {
  res.send("This is EatPlaySleep Server");
});
require('./routes/auth')(app);
require('./routes/user')(app);
require('./routes/baby')(app);
require('./routes/activity')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on Port:${PORT}`));