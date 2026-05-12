const express = require('express');
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  registerFarmer,
  registerBuyer,
  registerTransport,
  register,
  googleLogin,
  loginEmail,
  getMe,
  refreshToken,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { 
  validate, 
  sendOtpSchema, 
  verifyOtpSchema, 
  registerFarmerSchema, 
  registerBuyerSchema, 
  registerTransportSchema,
  registerSchema 
} = require('../validators/authValidator');

// ── Public Routes ─────────────────────────────────────────
router.post('/send-otp',            validate(sendOtpSchema),           sendOtp);
router.post('/verify-otp',          validate(verifyOtpSchema),          verifyOtp);
router.post('/google',                                                   googleLogin);
router.post('/login/email',                                              loginEmail);
router.post('/login',                                                    loginEmail); // Alias for frontend
router.post('/refresh',                                                  refreshToken);
router.post('/register',            validate(registerSchema),           register);
router.post('/register/farmer',     validate(registerFarmerSchema),     registerFarmer);
router.post('/register/buyer',      validate(registerBuyerSchema),      registerBuyer);
router.post('/register/transport',  validate(registerTransportSchema),  registerTransport);

// ── Protected Routes ──────────────────────────────────────
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe); // Alias for frontend

module.exports = router;
