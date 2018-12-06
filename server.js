/** Configure Environment Variables */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

/** Dependencies */
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

/** Initalize App */
const app = express();
app.enable('trust proxy');

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
const routes = require('./routes');
app.use('/', routes);

/** Run Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on Port:${PORT}`));