// OTP store backed by Redis (config/redis.js) with automatic in-memory fallback.
// Survives server restarts and works across multiple instances on Render.
const redis = require('../config/redis');

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
const OTP_PREFIX = 'otp:';

/**
 * generateOTP - Generate and store a mock OTP (always 123456 for demo)
 * @param {string} phone - Phone number
 * @returns {string} otp
 */
const generateOTP = async (phone) => {
  const otp = '123456'; // MOCK: always 123456 for demo/hackathon
  await redis.setEx(`${OTP_PREFIX}${phone}`, OTP_TTL_SECONDS, otp);
  console.log(`[OTP] Generated OTP ${otp} for ${phone}`);
  return otp;
};

/**
 * verifyOTP - Verify the OTP for a given phone number (one-time use)
 * @param {string} phone - Phone number
 * @param {string} otp - OTP entered by user
 * @returns {boolean}
 */
const verifyOTP = async (phone, otp) => {
  const key = `${OTP_PREFIX}${phone}`;
  const stored = await redis.get(key);
  if (!stored) return false;
  if (stored !== otp) return false;
  await redis.del(key); // one-time use
  return true;
};

module.exports = { generateOTP, verifyOTP };
