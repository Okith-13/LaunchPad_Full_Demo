const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAccessToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// Protected Admin route
router.delete(
  '/users/:id',
  authenticateAccessToken,
  authorizeRole('admin'),
  authController.deleteUser
);

module.exports = router;