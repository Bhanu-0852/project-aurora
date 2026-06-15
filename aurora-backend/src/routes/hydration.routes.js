const express = require('express');
const router = express.Router();
const hydrationController = require('../controllers/hydration.controller');
const auth = require('../middleware/auth.middleware');

router.get('/today', auth, hydrationController.getToday);
router.post('/log', auth, hydrationController.logWater);
router.get('/history', auth, hydrationController.getHistory);

module.exports = router;