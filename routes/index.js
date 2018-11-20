const router = require('express').Router();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const babyRoutes = require('./baby');
const activityRoutes = require('./activity');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/', (req, res) => res.send("This is EatPlaySleep Server"));
router.use('/auth', authRoutes);
router.use('/api/user', isAuthenticated, userRoutes);
router.use('/api/baby', isAuthenticated, babyRoutes);
router.use('/api/activity', isAuthenticated, activityRoutes);

module.exports = router;