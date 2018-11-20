const router = require('express').Router();
const {
  getActivitiesByBabyId,
  getActivityById,
  getActivitySummaryByDate,
  getActivityTrend,
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
router.get('/trend', getActivityTrend);

module.exports = router;