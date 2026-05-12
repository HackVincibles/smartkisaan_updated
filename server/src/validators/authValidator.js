const Joi = require('joi');

const sendOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a valid 10-digit Indian number starting with 6-9',
      'any.required': 'Phone number is required',
    }),
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be exactly 6 digits',
  }),
});

const registerFarmerSchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().optional().allow('', null),
  aadhaar: Joi.string().length(12).pattern(/^\d+$/).optional().allow('', null),
  upiId: Joi.string().optional().allow('', null),
  preferredLanguage: Joi.string().valid('hi', 'en', 'mr', 'ta', 'te', 'bn').default('hi'),
  farmLocation: Joi.object({
    address: Joi.string().optional().allow(''),
    village: Joi.string().optional().allow(''),
    district: Joi.string().optional().allow(''),
    state: Joi.string().optional().allow(''),
    pincode: Joi.string().length(6).optional().allow(''),
    lat: Joi.number().optional().allow(null),
    lng: Joi.number().optional().allow(null),
  }).optional(),
  farmSize: Joi.object({
    value: Joi.number().positive().optional(),
    unit: Joi.string().valid('acres', 'hectares', 'bigha').default('acres'),
  }).optional(),
  crops: Joi.array().items(Joi.string()).optional(),
  // Google OAuth fields (passed when registering via Google)
  googleId: Joi.string().optional().allow('', null),
  profilePhoto: Joi.string().uri().optional().allow('', null),
});

const registerBuyerSchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().optional().allow('', null),
  aadhaar: Joi.string().length(12).pattern(/^\d+$/).optional().allow('', null),
  upiId: Joi.string().optional().allow('', null),
  preferredLanguage: Joi.string().valid('hi', 'en', 'mr', 'ta', 'te', 'bn').default('hi'),
  businessType: Joi.string()
    .valid('wholesaler', 'retailer', 'hotel', 'restaurant', 'factory', 'exporter', 'individual')
    .default('individual'),
  businessName: Joi.string().optional().allow('', null),
  gstNumber: Joi.string().optional().allow('', null),
  address: Joi.object({
    street: Joi.string().optional().allow(''),
    city: Joi.string().optional().allow(''),
    state: Joi.string().optional().allow(''),
    pincode: Joi.string().length(6).optional().allow(''),
    lat: Joi.number().optional().allow(null),
    lng: Joi.number().optional().allow(null),
  }).optional(),
  // Google OAuth fields (passed when registering via Google)
  googleId: Joi.string().optional().allow('', null),
  profilePhoto: Joi.string().uri().optional().allow('', null),
});

const registerTransportSchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().optional().allow('', null),
  preferredLanguage: Joi.string().valid('hi', 'en', 'mr', 'ta', 'te', 'bn').default('hi'),
  agencyName: Joi.string().min(2).max(100).required(),
  vehicleType: Joi.string()
    .valid('truck', 'mini-truck', 'van', 'bike', 'tempo', 'pickup', 'refrigerated')
    .required(),
  licenseNumber: Joi.string().required(),
  vehicleCount: Joi.number().integer().min(1).default(1),
  routes: Joi.array().items(Joi.string()).optional(),
  // Google OAuth fields
  googleId: Joi.string().optional().allow('', null),
  profilePhoto: Joi.string().uri().optional().allow('', null),
});

const registerSchema = Joi.object({
  role: Joi.string().valid('farmer', 'buyer', 'transport').required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().optional().allow('', null),
  aadhaar: Joi.string().length(12).pattern(/^\d+$/).optional().allow('', null),
  upiId: Joi.string().optional().allow('', null),
  preferredLanguage: Joi.string().valid('hi', 'en', 'mr', 'ta', 'te', 'bn').default('hi'),
  // Role specific fields (made optional in unified schema)
  farmLocation: Joi.object().optional(),
  farmSize: Joi.object().optional(),
  crops: Joi.array().items(Joi.string()).optional(),
  businessType: Joi.string().optional(),
  businessName: Joi.string().optional().allow('', null),
  gstNumber: Joi.string().optional().allow('', null),
  address: Joi.object().optional(),
  agencyName: Joi.string().optional(),
  vehicleType: Joi.string().optional(),
  vehicleCount: Joi.number().optional(),
  routes: Joi.array().items(Joi.string()).optional(),
  googleId: Joi.string().optional().allow('', null),
  profilePhoto: Joi.string().uri().optional().allow('', null),
  password: Joi.string().min(6).optional().allow('', null),
});

// Validator middleware factory
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ success: false, error: messages, code: 'VALIDATION_ERROR' });
  }
  req.body = value; // use sanitized values
  next();
};

module.exports = {
  validate,
  sendOtpSchema,
  verifyOtpSchema,
  registerFarmerSchema,
  registerBuyerSchema,
  registerTransportSchema,
  registerSchema,
};
