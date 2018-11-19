const jwt = require('jsonwebtoken');
const { onFail } = require('../utils/formatResponse');
const db = require('../database');

module.exports = (req, res, done) => {
  const token = req.headers['x-oauth-token'];
  if (!token) return res.json(onFail('user not logged in'));
  else {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return res.json(onFail(error));
      else {
        db('users')
          .where('id', '=', decoded.id)
          .then(user => {
            req.user = user[0];
            done();
          });
      }
    })
  }
}