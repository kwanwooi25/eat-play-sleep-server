const router = require('express').Router();
const {
  getBabiesByGuardianId,
  addBaby,
  updateBaby,
  removeBaby
} = require('../controllers/baby');

router.get('/', getBabiesByGuardianId);
router.post('/', addBaby);
router.put('/', updateBaby);
router.delete('/', removeBaby);

module.exports = router;