const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');
const randomId = require('../utils/generateRandomID');

/**
 * 
 * @param {String} req.query.userID
 */
const getBabiesByGuardianId = (req, res) => {
  const { userID } = req.query;

  db('babies')
    .whereRaw(`guardians @> '[{"id": "${userID}"}]'`)
    .then(babies => res.json(onSuccess(babies)))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {Object} req.body.baby
 * @desc add new baby object
 */
const addBaby = (req, res) => {
  let baby = req.body;
  const userID = baby.guardians[0].id;

  baby.id = randomId();
  baby.guardians = JSON.stringify(baby.guardians);

  db.transaction(trx => {
    trx('babies')
      .insert(baby)
      .returning('*')
      .then(baby => {
        return trx('users')
          .where('id', '=', userID)
          .then(user => {
            if (user.length > 0) {
              user[0].settings.currentBabyId = baby[0].id;
              return trx('users')
                .where('id', '=', userID)
                .update(user[0])
            }
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
  .then(() => res.json(onSuccess('baby added successfully')))
  .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {Object} req.body.baby
 * @desc update baby object
 */
const updateBaby = (req, res) => {
  let baby = req.body;
  baby.guardians = JSON.stringify(baby.guardians);

  db('babies')
    .where('id', '=', baby.id)
    .update(baby)
    .returning('*')
    .then(baby => res.json(onSuccess(baby[0])))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {String} req.query.babyID
 * @desc
 * 1. removes baby from babies table,
 * 2. removes currentBabyId from guardians' settings field
 * 3. removes activities of the baby       
 */
const removeBaby = (req, res) => {
  const { babyID } = req.query;

  db.transaction(trx => {
    trx('babies')
      .where('id', '=', babyID)
      .delete()
      .then(res => {
        return trx('users')
          .whereRaw(`settings ->> 'currentBabyId' = '${babyID}'`)
          .then(users => {
            if (users.length) {
              return users.map(user => {
                user.settings.currentBabyId = '';
                return trx('users').where('id', '=', user.id).update(user)
              });
            }
          })
          .then(() => trx('activities').where('baby_id', '=', babyID).delete())
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
  .then(() => res.json(onSuccess('baby deleted successfully')))
  .catch(error => res.json(onFail(error)));
}

module.exports = { getBabiesByGuardianId, addBaby, updateBaby, removeBaby };