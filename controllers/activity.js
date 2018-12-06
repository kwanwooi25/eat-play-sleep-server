const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');
const randomId = require('../utils/generateRandomID');
const formSummary = require('../utils/formSummary');

/**
 * 
 * @param {String} req.query.babyID
 * @param {Object} req.query.options
 * @desc fetch all activities of baby
 */
const getActivitiesByBabyId = (req, res) => {
  const { babyID, options } = req.query;
  const { name } = JSON.parse(options);
  
  db('activities')
    .where('baby_id', '=', babyID)
    .andWhere(function() { this.whereIn('name', name) })
    .orderBy('time_start', 'desc')
    .then(activities => res.json(onSuccess(activities)))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {String} req.query.babyID
 * @param {Object} req.query.options contains activity name and search range
 * @desc fetch activity trend data by namd and date range
 */
const getActivitiesBetween = (req, res) => {
  const { babyID, options } = req.query;
  const { names, from, to } = JSON.parse(options);
  
  db('activities')
    .where('baby_id', '=', babyID)
    .andWhere(function() { this.whereIn('name', names) })
    .andWhereBetween('time_start', [from, to])
    .then(activities => res.json(onSuccess(activities)))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {String} req.query.activityID 
 * @desc fetch an activity by id
 */
const getActivityById = (req, res) => {
  const { activityID } = req.query;
  
  db('activities')
    .where('id', '=', activityID)
    .then(activities => res.json(onSuccess(activities[0])))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {String} req.query.babyID 
 * @param {Object} req.query.range
 * @desc fetch activity summary data of the date 
 */
const getActivitySummaryByDate = (req, res) => {
  const { babyID, range } = req.query;
  const { from, to } = JSON.parse(range);
  
  db('activities')
    .where('baby_id', '=', babyID)
    .andWhereBetween('time_start', [from, to])
    .then(activities => res.json(onSuccess(formSummary(activities))))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {Object} req.body 
 * @desc create activity
 */
const addActivity = (req, res) => {
  let activity = req.body;

  activity.id = randomId();

  db('activities')
    .insert(activity)
    .returning('*')
    .then(activities => res.json(onSuccess(activities[0])))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {Object} req.body 
 * @desc update activity
 */
const updateActivity = (req, res) => {
  const activity = req.body;

  db('activities')
    .where('id', '=', activity.id)
    .update(activity)
    .returning('*')
    .then(activities => res.json(onSuccess(activities[0])))
    .catch(error => res.json(onFail(error)));
}

/**
 * 
 * @param {String} req.query.activityID
 * @desc remove activity
 */
const removeActivity = (req, res) => {
  const { activityID } = req.query;

  db('activities')
    .where('id', '=', activityID)
    .delete()
    .then(result => res.json(onSuccess(`${result} item has been deleted`)))
    .catch(error => res.json(onFail(error)));
}

module.exports = {
  getActivitiesByBabyId,
  getActivitiesBetween,
  getActivityById,
  getActivitySummaryByDate,
  addActivity,
  updateActivity,
  removeActivity
};