/** Configure Environment Variables */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

/** Dependencies */
const express = require('express');
const fs = require('fs');
const https = require('https');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

/** Initalize App */
const app = express();

/** SSL Certificate */
const credentials = {
  key:
    fs.existsSync('/etc/letsencrypt/live/api.epsapp0.com/privkey.pem') ?
    fs.readFileSync('/etc/letsencrypt/live/api.epsapp0.com/privkey.pem', 'utf8') :
    fs.readFileSync('server.key'),
  cert:
    fs.existsSync('/etc/letsencrypt/live/api.epsapp0.com/cert.pem') ?
    fs.readFileSync('/etc/letsencrypt/live/api.epsapp0.com/cert.pem', 'utf8') :
    fs.readFileSync('server.cert'),
};

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
// app.listen(PORT, () => console.log(`Server is running on Port:${PORT}`));
https
  .createServer(credentials, app)
  .listen(PORT, () => console.log(`Server is running on Port:${PORT}`));