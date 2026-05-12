const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/config');

/**
 * generateToken - Create a signed JWT
 * @param {string} userId - MongoDB _id of the user
 * @param {string} role - farmer | buyer | transport | admin
 * @returns {string} signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

/**
 * generateRefreshToken - Create a longer-lived refresh token
 * @param {string} userId
 * @returns {string} signed JWT
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, isRefresh: true }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * verifyToken - Verify and decode a JWT
 * @param {string} token - Raw JWT string
 * @returns {object} decoded payload { id, role, iat, exp }
 * @throws {Error} if invalid or expired
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, generateRefreshToken, verifyToken };
