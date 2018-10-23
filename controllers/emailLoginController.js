const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { onSuccess, onFail } = require('../utils/formatResponse');

module.exports = (req, res) => {
  const { email, password } = req.body;

  return db('users')
    .where('email', '=', email)
    .then(user => {
      /**
       * when the user exists,
       * look up 'login' table for password verification
       */
      if (user.length) {
        return db('login')
          .where('id', '=', user[0].id)
          .then(loginInfo => {
            const isVerified = bcrypt.compareSync(password, loginInfo[0].password);
            /**
             * if the password match,
             * return user info
             */
            if (isVerified) {
              const options = { expiresIn: 60 * 60 * 24 * 6 }; // expires in 6 hours

              jwt.sign(
                user[0],
                process.env.JWT_SECRET,
                options,
                (error, token) => {
                  if (!error) {
                    res.json(onSuccess({ token, user: user[0] }));
                  }
                }
              );
            } else {
              res.json(onFail('unauthorized'));
            }
          });
      /**
       * when the user doesn't exist
       */
      } else {
        res.json(onFail('user not found'));
      }
    })
    .catch(error => res.json(onFail(error)));;
}