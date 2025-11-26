const express = require('express');
const router = express.Router();
const { getChatHistory, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getChatHistory);

module.exports = router;
