const router = require('express').Router();
const {
  getActivitiesByBabyId,
  getActivitiesBetween,
  getActivityById,
  getActivitySummaryByDate,
  addActivity,
  updateActivity,
  removeActivity
} = require('../controllers/activity');

router.get('/all', getActivitiesByBabyId);
router.get('/', getActivityById);
router.post('/', addActivity);
router.put('/', updateActivity);
router.delete('/', removeActivity);
router.get('/summary', getActivitySummaryByDate);
router.get('/trend', getActivitiesBetween);

module.exports = router;