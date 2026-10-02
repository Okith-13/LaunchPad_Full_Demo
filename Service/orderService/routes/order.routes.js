const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, controller.createOrder);
router.get('/my-orders', authenticateToken, controller.getMyOrders);
router.get('/:id', authenticateToken, controller.getOrderById);
router.get('/restaurant/:restaurantId', authenticateToken, controller.getRestaurantOrders);
router.patch('/:id/status', authenticateToken, controller.updateStatus);

module.exports = router;