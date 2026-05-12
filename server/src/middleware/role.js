const { sendError } = require('../utils/responseHelper');

/**
 * requireRole - Factory function that returns a role-check middleware
 * @param {...string} roles - Allowed roles e.g. requireRole('farmer', 'admin')
 * Usage: router.post('/route', protect, requireRole('farmer'), handler)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated.', 'NOT_AUTHENTICATED', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
        'FORBIDDEN_ROLE',
        403
      );
    }

    next();
  };
};

module.exports = { requireRole };
