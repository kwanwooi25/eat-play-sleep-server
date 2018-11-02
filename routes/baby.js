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
      .where('guardians', '?', userID)
      .then(babies => res.json(onSuccess(babies)))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * POST
   * add baby
   */
  app.post('/api/babies/add', (req, res) => {
    let baby = req.body;

    baby.id = randomId();
    baby.guardians = JSON.stringify(baby.guardians);

    db('babies')
      .insert(baby)
      .returning('*')
      .then(user => res.json(onSuccess(user[0])))
      .catch(error => res.json(onFail(error)));
  });
}