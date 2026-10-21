const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurant.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/', controller.getAllRestaurants);

router.get('/my-restaurant', authenticateToken, authorizeRoles('RESTAURANT_ADMIN', 'ADMIN'), controller.getMyRestaurant);

router.post('/', authenticateToken, authorizeRoles('RESTAURANT_ADMIN', 'ADMIN'), controller.createRestaurant);
router.get('/:id', controller.getRestaurantById);
router.put('/:id', authenticateToken, authorizeRoles('RESTAURANT_ADMIN', 'ADMIN'), controller.updateRestaurant);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), controller.deleteRestaurant);

module.exports = router;