const express = require('express');
const router = express.Router();
const controller = require('../controllers/menu.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/restaurant/:restaurantId', controller.getMenuByRestaurant);
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.createMenuItem);
router.patch('/:id/availability', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.updateAvailability);

module.exports = router;