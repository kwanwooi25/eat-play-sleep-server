const jwt = require('jsonwebtoken');
const { onSuccess } = require('../utils/formatResponse');

/**
 * 
 * @desc redirects user on oauth login success
 */
const redirectUser = (req, res) => {
  const token = jwt.sign(
    { id: req.user.id },
    process.env.JWT_SECRET,
    { expiresIn: 24 * 60 * 60 },
  );

  res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
}

/**
 * 
 * @param {Object} req.user
 * @desc sends user object 
 */
const sendUserInfo = (req, res) => res.json(onSuccess(req.user));

module.exports = { redirectUser, sendUserInfo };