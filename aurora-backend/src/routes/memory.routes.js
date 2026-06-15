const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memory.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, memoryController.getMemory);
router.post('/add', auth, memoryController.addObservation);

module.exports = router;