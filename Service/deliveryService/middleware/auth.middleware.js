const jwt = require('jsonwebtoken');
const { error } = require('../utils/response.util');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return error(res, 401, 'Access token required');

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return error(res, 403, 'Invalid or expired token');
    req.user = decoded;
    next();
  });
};