const { verifyToken } = require('../utils/jwtHelper');
const { sendError } = require('../utils/responseHelper');
const User = require('../models/User');

/**
 * protect - Middleware to verify JWT and attach user to req.user
 * Usage: router.get('/route', protect, handler)
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Access denied. No token provided.', 'NO_TOKEN', 401);
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendError(res, 'User not found. Token may be invalid.', 'USER_NOT_FOUND', 401);
    }

    // ── Ban check ──────────────────────────────────────────
    if (user.isBanned) {
      const banActive = !user.banExpiresAt || user.banExpiresAt > new Date();
      if (banActive) {
        const until = user.banExpiresAt
          ? `until ${user.banExpiresAt.toISOString()}`
          : 'permanently';
        return sendError(
          res,
          `Your account has been banned ${until}.`,
          'ACCOUNT_BANNED',
          403
        );
      }
      // Ban expired — auto-lift it
      user.isBanned = false;
      user.banExpiresAt = null;
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please login again.', 'TOKEN_EXPIRED', 401);
    }
    return sendError(res, 'Invalid token.', 'INVALID_TOKEN', 401);
  }
};

module.exports = { protect };
