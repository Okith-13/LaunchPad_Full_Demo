const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const newUser = await authService.registerUser({ name, email, password, role });
    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.loginUser({ email, password });
    return res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const tokens = await authService.refreshSession(refreshToken);
    return res.status(200).json({
      message: 'Tokens refreshed successfully',
      ...tokens,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await authService.deleteUserById(req.params.id);
    return res.status(200).json({ message: `User with ID ${req.params.id} deleted successfully` });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};