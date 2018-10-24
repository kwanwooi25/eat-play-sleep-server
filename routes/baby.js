const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');

/** Random ID Generator */
const randomId = require('random-id');
const length = 20;
const pattern = '0'; // generates Id only with numbers

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

    baby.id = randomId(length, pattern);
    baby.guardians = JSON.stringify(baby.guardians);

    db('babies')
      .insert(baby)
      .returning('*')
      .then(user => res.json(onSuccess(user[0])))
      .catch(error => res.json(onFail(error)));
  });
}