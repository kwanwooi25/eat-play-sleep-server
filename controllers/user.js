const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');

const updateUser = (req, res) => {
  const user = req.body;

  db('users')
    .where('id', '=', user.id)
    .update(user)
    .then(() => res.json(onSuccess('user updated successfully')))
    .catch(error => res.json(onFail(error)));
}

module.exports = { updateUser };