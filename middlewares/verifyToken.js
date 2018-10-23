const jwt = require('jsonwebtoken');

module.exports = (req, res, done) => {
  const token = req.headers['x-access-token'] || req.query.token;
  /** 
   * if token exists,
   * decode it and pass
   */
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (error, decoded) => {
        if (!error) req.decoded = decoded;
      }
    );
  }

  done();
}