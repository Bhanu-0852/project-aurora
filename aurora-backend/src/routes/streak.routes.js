const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streak.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, streakController.getStreaks);

module.exports = router;