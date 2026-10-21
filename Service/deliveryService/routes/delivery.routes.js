const express = require('express');
const router = express.Router();
const controller = require('../controllers/delivery.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Public/Internal creation
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.createDelivery);

// Rider actions
router.get('/available', authenticateToken, authorizeRoles('DELIVERY_PERSON', 'ADMIN'), controller.getAvailableDeliveries);
router.get('/my-assignments', authenticateToken, authorizeRoles('DELIVERY_PERSON'), controller.getMyDeliveries);
router.patch('/:id/accept', authenticateToken, authorizeRoles('DELIVERY_PERSON'), controller.acceptDelivery);

router.patch('/:id/assign', authenticateToken, authorizeRoles('ADMIN'), controller.assignRider);
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN', 'DELIVERY_PERSON'), controller.updateStatus);
router.get('/:id', authenticateToken, controller.getDeliveryById);

module.exports = router;