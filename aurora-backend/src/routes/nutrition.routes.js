const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutrition.controller');
const auth = require('../middleware/auth.middleware');

router.get('/today', auth, nutritionController.getToday);
router.post('/log', auth, nutritionController.logMeal);

module.exports = router;