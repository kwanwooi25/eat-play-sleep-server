const router = require('express').Router();
const { updateUser } = require('../controllers/user');

router.put('/', updateUser);

module.exports = router;