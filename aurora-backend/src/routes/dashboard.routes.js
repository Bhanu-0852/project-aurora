const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth.middleware');

router.get('/summary', auth, dashboardController.getSummary);
router.get('/insight', auth, dashboardController.getDailyInsight);

module.exports = router;