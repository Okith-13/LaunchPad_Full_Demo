const express = require('express');
const router = express.Router();
const controller = require('../controllers/delivery.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.post('/', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.createDelivery);
router.patch('/:id/assign', authenticateToken, authorizeRoles('ADMIN'), controller.assignRider);
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN', 'DELIVERY_PERSON'), controller.updateStatus);
router.get('/my-assignments', authenticateToken, authorizeRoles('DELIVERY_PERSON'), controller.getMyDeliveries);
router.get('/:id', authenticateToken, controller.getDeliveryById);

module.exports = router;