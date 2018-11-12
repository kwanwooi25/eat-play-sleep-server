const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');
const randomId = require('../utils/generateRandomID');

module.exports = app => {

  /**
   * GET
   * get all babies by user id
   */
  app.get('/api/babies', (req, res) => {
    const { userID } = req.query;

    db('babies')
      .whereRaw(`guardians @> '[{"id": "${userID}"}]'`)
      .then(babies => res.json(onSuccess(babies)))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * POST
   * add baby
   */
  app.post('/api/babies', (req, res) => {
    let baby = req.body;

    baby.id = randomId();
    baby.guardians = JSON.stringify(baby.guardians);

    db('babies')
      .insert(baby)
      .returning('*')
      .then(user => res.json(onSuccess(user[0])))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * PUT
   * edit baby
   */
  app.put('/api/babies', (req, res) => {
    let baby = req.body;
    baby.guardians = JSON.stringify(baby.guardians);

    db('babies')
      .where('id', '=', baby.id)
      .update(baby)
      .returning('*')
      .then(user => res.json(onSuccess(user[0])))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * DELETE
   * delete baby and all activities
   */
  app.delete('/api/babies', (req, res) => {
    const { babyID } = req.query;

    db.transaction(trx => {
      trx('babies')
        .where('id', '=', babyID)
        .delete()
        .then(res => {
          if (res) {
            return trx('activities')
              .where('baby_id', '=', babyID)
              .delete()
          }
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .then(() => res.json(onSuccess('baby deleted successfully')))
    .catch(error => res.json(onFail(error)));
  })
}