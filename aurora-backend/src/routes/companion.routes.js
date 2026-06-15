const express = require('express');
const router = express.Router();
const companionController = require('../controllers/companion.controller');
const auth = require('../middleware/auth.middleware');

router.post('/chat', auth, companionController.chatWithAurora);
router.post('/voice', auth, companionController.voiceChat);

module.exports = router;