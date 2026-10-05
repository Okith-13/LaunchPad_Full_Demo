const express = require('express');
const router = express.Router();
const controller = require('../controllers/address.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, controller.addAddress);
router.get('/', authenticateToken, controller.getAddresses);
router.delete('/:id', authenticateToken, controller.deleteAddress);

module.exports = router;