const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleep.controller');
const auth = require('../middleware/auth.middleware');

router.post('/log', auth, sleepController.logSleep);
router.get('/history', auth, sleepController.getHistory);
router.get('/analytics', auth, sleepController.getAnalytics);

module.exports = router;