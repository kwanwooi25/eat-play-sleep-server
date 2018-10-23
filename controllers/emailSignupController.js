const bcrypt = require('bcrypt-nodejs');
const db = require('../database');
const { onSuccess, onFail } = require('../utils/formatResponse');

/** Random ID Generator */
const randomId = require('random-id');
const length = 20;
const pattern = '0'; // generates Id only with numbers

module.exports = (req, res) => {
  const { email, password } = req.body;
  const newUser = {
    id: randomId(length, pattern),
    provider: 'email',
    email: email
  };
  const newUserLogin = {
    id: newUser.id,
    password: bcrypt.hashSync(password)
  };

  db('users')
    .where('email', '=', email)
    .then(user => {
      /**
       * when the user exists
       */
      if (user.length) {
        res.json(onFail('user exists'));
      /**
       * when the user doesn't exist,
       * create new user account
       */
      } else {
        return db.transaction(trx => {
          /** Create new user */
          return trx.insert(newUser)
            .into('users')
            .returning('*')
            .then(user => {
              /** Store new user's login info */
              return trx.insert(newUserLogin)
                .into('login')
                .then(() => res.json(onSuccess(user[0])));
            })
            .then(trx.commit)
            .catch(trx.rollback);
        });
      }
    })
    .catch(error => res.json(onFail(error)));;
}