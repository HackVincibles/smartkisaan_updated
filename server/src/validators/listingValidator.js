const Joi = require('joi');

const createListingSchema = Joi.object({
  productName: Joi.string().min(2).max(100).required(),
  category: Joi.string()
    .valid('vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other')
    .required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().valid('kg', 'quintal', 'ton', 'dozen', 'litre', 'piece').required(),
  expectedPrice: Joi.number().positive().required(),
  harvestDate: Joi.date().optional().allow(null),
  isOrganic: Joi.boolean().default(false),
  description: Joi.string().max(500).optional().allow('', null),
  storageCondition: Joi.string()
    .valid('room-temp', 'refrigerated', 'frozen', 'dry')
    .default('room-temp'),
  location: Joi.object({
    lat: Joi.number().optional().allow(null),
    lng: Joi.number().optional().allow(null),
    district: Joi.string().optional().allow(''),
    state: Joi.string().optional().allow(''),
  }).optional(),
});

const updateListingSchema = Joi.object({
  productName: Joi.string().min(2).max(100).optional(),
  quantity: Joi.number().positive().optional(),
  expectedPrice: Joi.number().positive().optional(),
  description: Joi.string().max(500).optional().allow('', null),
  isOrganic: Joi.boolean().optional(),
  storageCondition: Joi.string().valid('room-temp', 'refrigerated', 'frozen', 'dry').optional(),
});

const placeBidSchema = Joi.object({
  bidPrice: Joi.number().positive().required().messages({
    'any.required': 'Bid price is required',
    'number.positive': 'Bid price must be a positive number',
  }),
  quantity: Joi.number().positive().required(),
  deliveryAddress: Joi.string().min(3).required(),
  deliveryLocation: Joi.object({
    lat: Joi.number().optional().allow(null),
    lng: Joi.number().optional().allow(null),
  }).optional(),
  expectedDeliveryDate: Joi.date().min('now').optional().allow(null),
  notes: Joi.string().max(300).optional().allow('', null),
});

const createDemandSchema = Joi.object({
  productName: Joi.string().min(2).max(100).required(),
  category: Joi.string()
    .valid('vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other')
    .required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().valid('kg', 'quintal', 'ton', 'dozen', 'litre', 'piece').required(),
  maxBudget: Joi.number().positive().required(),
  requiredByDate: Joi.date().min('now').optional().allow(null),
  deliveryAddress: Joi.string().min(3).required(),
  isOrganic: Joi.boolean().default(false),
  notes: Joi.string().max(300).optional().allow('', null),
});

// Middleware factory (reusing same pattern from authValidator)
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ success: false, error: messages, code: 'VALIDATION_ERROR' });
  }
  req.body = value;
  next();
};

module.exports = {
  validate,
  createListingSchema,
  updateListingSchema,
  placeBidSchema,
  createDemandSchema,
};
