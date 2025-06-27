const express = require('express');
const router = express.Router();
const { sendWhatsAppMessage } = require('../controllers/whatsappController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send', sendWhatsAppMessage);

module.exports = router;
