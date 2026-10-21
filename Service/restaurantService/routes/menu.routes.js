const express = require('express');
const router = express.Router();
const controller = require('../controllers/menu.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/restaurant/:restaurantId', controller.getMenuByRestaurant);
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.createMenuItem);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.updateMenuItem);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.deleteMenuItem);
router.patch('/:id/availability', authenticateToken, authorizeRoles('ADMIN', 'RESTAURANT_ADMIN'), controller.updateAvailability);

module.exports = router;