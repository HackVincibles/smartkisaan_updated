const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const TransportAgency = require('../models/TransportAgency');

const { generateOTP, verifyOTP } = require('../utils/otpHelper');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwtHelper');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { verifyGoogleToken } = require('../utils/googleAuth');
const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────
// @desc    Send OTP to phone number (mock: always 123456)
// @route   POST /api/v1/auth/send-otp
// @access  Public
// ─────────────────────────────────────────────────────────
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    await generateOTP(phone); // async — backed by Redis
    // Production: integrate SMS gateway (Twilio / MSG91)
    return sendSuccess(res, { phone }, 'OTP sent successfully. Use 123456 for demo.');
  } catch (error) {
    console.error('[sendOtp]', error);
    return sendError(res, 'Failed to send OTP', 'OTP_SEND_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Verify OTP → login or signal new registration
// @route   POST /api/v1/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const isValid = await verifyOTP(phone, otp); // async — backed by Redis
    if (!isValid) {
      return sendError(res, 'Invalid or expired OTP', 'INVALID_OTP', 401);
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      const token = generateToken(existingUser._id, existingUser.role);
      const refreshToken = generateRefreshToken(existingUser._id);
      return sendSuccess(res, { token, refreshToken, user: existingUser, isNewUser: false }, 'Login successful');
    }

    return sendSuccess(res, { isNewUser: true, phone }, 'OTP verified. Please complete registration.');
  } catch (error) {
    console.error('[verifyOtp]', error);
    return sendError(res, 'OTP verification failed', 'OTP_VERIFY_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Register a new Farmer
// @route   POST /api/v1/auth/register/farmer
// @access  Public
// ─────────────────────────────────────────────────────────
const registerFarmer = async (req, res) => {
  try {
    const {
      phone, name, email, aadhaar, upiId, preferredLanguage,
      farmLocation, farmSize, crops, googleId, profilePhoto, password,
    } = req.body;

    const query = [
      phone ? { phone } : null,
      googleId ? { googleId } : null,
    ].filter(Boolean);

    const existingUser = query.length ? await User.findOne({ $or: query }) : null;
    if (existingUser) {
      return sendError(res, 'User with this phone or Google account already exists', 'USER_ALREADY_EXISTS', 409);
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      phone, name, email, aadhaar, upiId, preferredLanguage,
      role: 'farmer',
      password: hashedPassword,
      authProvider: googleId ? 'google' : (password ? 'email_password' : 'phone_otp'),
      googleId: googleId || null,
      profilePhoto: profilePhoto || null,
    });

    const farmer = await Farmer.create({
      userId: user._id,
      farmLocation: farmLocation || {},
      farmSize: farmSize || {},
      crops: crops || [],
    });

    const token = generateToken(user._id, 'farmer');
    const refreshToken = generateRefreshToken(user._id);
    return sendSuccess(res, { token, refreshToken, user, farmer }, 'Farmer registered successfully', 201);
  } catch (error) {
    console.error('[registerFarmer]', error);
    if (error.code === 11000) return sendError(res, 'User already registered', 'DUPLICATE_USER', 409);
    return sendError(res, 'Registration failed', 'REGISTRATION_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Register a new Buyer
// @route   POST /api/v1/auth/register/buyer
// @access  Public
// ─────────────────────────────────────────────────────────
const registerBuyer = async (req, res) => {
  try {
    const {
      phone, name, email, aadhaar, upiId, preferredLanguage,
      businessType, businessName, gstNumber, address, googleId, profilePhoto, password,
    } = req.body;

    const query = [
      phone ? { phone } : null,
      googleId ? { googleId } : null,
    ].filter(Boolean);

    const existingUser = query.length ? await User.findOne({ $or: query }) : null;
    if (existingUser) {
      return sendError(res, 'User with this phone or Google account already exists', 'USER_ALREADY_EXISTS', 409);
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      phone, name, email, aadhaar, upiId, preferredLanguage,
      role: 'buyer',
      password: hashedPassword,
      authProvider: googleId ? 'google' : (password ? 'email_password' : 'phone_otp'),
      googleId: googleId || null,
      profilePhoto: profilePhoto || null,
    });

    const buyer = await Buyer.create({
      userId: user._id,
      businessType: businessType || 'individual',
      businessName, gstNumber,
      address: address || {},
    });

    const token = generateToken(user._id, 'buyer');
    const refreshToken = generateRefreshToken(user._id);
    return sendSuccess(res, { token, refreshToken, user, buyer }, 'Buyer registered successfully', 201);
  } catch (error) {
    console.error('[registerBuyer]', error);
    if (error.code === 11000) return sendError(res, 'User already registered', 'DUPLICATE_USER', 409);
    return sendError(res, 'Registration failed', 'REGISTRATION_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Register a new Transport Agency
// @route   POST /api/v1/auth/register/transport
// @access  Public
// ─────────────────────────────────────────────────────────
const registerTransport = async (req, res) => {
  try {
    const {
      phone, name, email, preferredLanguage,
      agencyName, vehicleCount, vehicleTypes, routes, googleId, profilePhoto, password,
    } = req.body;

    const query = [
      phone ? { phone } : null,
      googleId ? { googleId } : null,
    ].filter(Boolean);

    const existingUser = query.length ? await User.findOne({ $or: query }) : null;
    if (existingUser) {
      return sendError(res, 'User with this phone or Google account already exists', 'USER_ALREADY_EXISTS', 409);
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      phone, name, email, preferredLanguage,
      role: 'transport',
      password: hashedPassword,
      authProvider: googleId ? 'google' : (password ? 'email_password' : 'phone_otp'),
      googleId: googleId || null,
      profilePhoto: profilePhoto || null,
    });

    const agency = await TransportAgency.create({
      userId: user._id,
      agencyName,
      vehicleCount: vehicleCount || 1,
      vehicleTypes: vehicleTypes || [],
      routes: routes || [],
    });

    const token = generateToken(user._id, 'transport');
    const refreshToken = generateRefreshToken(user._id);
    return sendSuccess(res, { token, refreshToken, user, agency }, 'Transport agency registered successfully', 201);
  } catch (error) {
    console.error('[registerTransport]', error);
    if (error.code === 11000) return sendError(res, 'User already registered', 'DUPLICATE_USER', 409);
    return sendError(res, 'Registration failed', 'REGISTRATION_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Google OAuth login/register (no Passport)
// @route   POST /api/v1/auth/google
// @access  Public
// Frontend sends Google id_token → backend verifies → returns JWT
// If new user → { isNewUser: true, googleData } → frontend shows role+phone form
// ─────────────────────────────────────────────────────────
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return sendError(res, 'Google id_token is required', 'MISSING_ID_TOKEN', 400);

    const googleData = await verifyGoogleToken(idToken);
    const { googleId, name, email, picture } = googleData;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (!user.profilePhoto && picture) user.profilePhoto = picture;
        await user.save();
      }
      const token = generateToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);
      return sendSuccess(res, { token, refreshToken, user, isNewUser: false }, 'Google login successful');
    }

    // New user — needs role selection + phone on frontend
    return sendSuccess(
      res,
      { isNewUser: true, googleData: { googleId, name, email, picture } },
      'Google verified. Please select your role and complete registration.'
    );
  } catch (error) {
    console.error('[googleLogin]', error);
    if (error.message?.includes('Token used too late')) {
      return sendError(res, 'Google token expired. Please try again.', 'GOOGLE_TOKEN_EXPIRED', 401);
    }
    return sendError(res, 'Google authentication failed', 'GOOGLE_AUTH_FAILED', 401);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Email + password login
// @route   POST /api/v1/auth/login/email
// @access  Public
// ─────────────────────────────────────────────────────────
const loginEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 'MISSING_CREDENTIALS', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return sendError(res, 'Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 'Invalid email or password', 'INVALID_CREDENTIALS', 401);

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return sendSuccess(res, { token, refreshToken, user: userObj }, 'Login successful');
  } catch (error) {
    console.error('[loginEmail]', error);
    return sendError(res, 'Login failed', 'LOGIN_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get currently logged in user
// @route   GET /api/v1/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  return sendSuccess(res, req.user, 'Current user fetched');
};

// ─────────────────────────────────────────────────────────
// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
// ─────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token is required', 'MISSING_REFRESH_TOKEN', 400);

    const decoded = verifyToken(refreshToken);
    if (!decoded || !decoded.isRefresh) {
      return sendError(res, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, 'User not found', 'USER_NOT_FOUND', 404);

    const token = generateToken(user._id, user.role);
    return sendSuccess(res, { token }, 'Token refreshed');
  } catch (error) {
    console.error('[refreshToken]', error);
    return sendError(res, 'Token refresh failed', 'REFRESH_FAILED', 401);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Unified Registration Endpoint
// @route   POST /api/v1/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────
const register = async (req, res) => {
  const { role } = req.body;
  if (role === 'farmer') return registerFarmer(req, res);
  if (role === 'buyer') return registerBuyer(req, res);
  if (role === 'transport') return registerTransport(req, res);
  return sendError(res, 'Invalid role specified for registration', 'INVALID_ROLE', 400);
};

module.exports = {
  sendOtp,
  verifyOtp,
  register,
  registerFarmer,
  registerBuyer,
  registerTransport,
  googleLogin,
  loginEmail,
  getMe,
  refreshToken,
};
