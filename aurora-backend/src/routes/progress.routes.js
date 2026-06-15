const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const auth = require('../middleware/auth.middleware');

router.get('/weekly', auth, progressController.getWeeklyReport);
router.get('/monthly', auth, progressController.getMonthlyReport);

module.exports = router;