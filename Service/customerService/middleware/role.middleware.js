const { error } = require('../utils/response.util');

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return error(res, 403, `Access forbidden. Requires roles: ${allowedRoles.join(', ')}`);
    }
    next();
  };
};