const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');
const randomId = require('../utils/generateRandomID');

module.exports = app => {

  /**
   * GET
   * get all activities by baby id
   */
  app.get('/api/activities', (req, res) => {
    const { babyID } = req.query;
    
    db('activities')
      .where('baby_id', '=', babyID)
      .orderBy('time_start', 'desc')
      .then(activities => res.json(onSuccess(activities)))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * POST
   * add activity
   */
  app.post('/api/activities/add', (req, res) => {
    let activity = req.body;

    activity.id = randomId();

    db('activities')
      .insert(activity)
      .returning('*')
      .then(activities => res.json(onSuccess(activities[0])))
      .catch(error => res.json(onFail(error)));
  });
}