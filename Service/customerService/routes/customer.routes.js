const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/profile', authenticateToken, controller.createProfile);
router.get('/profile', authenticateToken, controller.getProfile);
router.put('/profile', authenticateToken, controller.updateProfile);

module.exports = router;