const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, habitController.getHabits);
router.post('/', auth, habitController.createHabit);
router.put('/:id/complete', auth, habitController.completeHabit);
router.put('/:id/skip', auth, habitController.skipHabit);
router.put('/:id/pause', auth, habitController.pauseHabit);
router.put('/:id', auth, habitController.editHabit);
router.delete('/:id', auth, habitController.deleteHabit);

module.exports = router;