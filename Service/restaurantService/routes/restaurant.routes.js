const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurant.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', controller.getRestaurants);
router.get('/:id', controller.getRestaurantById);

// Protected routes 
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.createRestaurant);
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.updateStatus);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), controller.deleteRestaurant);

module.exports = router;