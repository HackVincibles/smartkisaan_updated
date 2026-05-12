const Listing = require('../models/Listing');
const Buyer = require('../models/Buyer');
const Order = require('../models/Order');
const AIScan = require('../models/AIScan');
const Payment = require('../models/Payment');
const DemandRequest = require('../models/DemandRequest');

const { sendSuccess, sendError } = require('../utils/responseHelper');
const { gradeQuality } = require('../services/aiService');
const { releaseEscrow } = require('../services/escrowService');
const { runTrustVerification } = require('../services/trust.worker');

const Joi = require('joi');
const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/config');
const { escapeRegex } = require('../utils/stringUtils');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ─── Helper ───────────────────────────────────────────────
const calculateFreightEstimate = (quantity, unit) => {
  const kg = unit === 'quintal' ? quantity * 100
    : unit === 'ton' ? quantity * 1000
    : unit === 'dozen' ? quantity * 0.5
    : quantity;
  if (kg <= 50)   return 200;
  if (kg <= 200)  return 500;
  if (kg <= 500)  return 1000;
  if (kg <= 1000) return 2000;
  return 3500;
};

// ─────────────────────────────────────────────────────────
// @desc    Search and filter marketplace listings
// @route   GET /api/v1/buyer/listings
// @access  Private (buyer)
// Query: ?search=&grade=&minPrice=&maxPrice=&organic=&category=&page=&limit=
// ─────────────────────────────────────────────────────────
const getListings = async (req, res) => {
  try {
    const schema = Joi.object({
      search: Joi.string().max(100).allow(''),
      grade: Joi.string().max(10).allow(''),
      minPrice: Joi.number().min(0).optional(),
      maxPrice: Joi.number().min(0).optional(),
      organic: Joi.string().valid('true', 'false').optional(),
      category: Joi.string().max(50).allow(''),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(12),
      district: Joi.string().max(50).allow(''),
      state: Joi.string().max(50).allow(''),
    }).unknown(true);

    const { error, value: q } = schema.validate(req.query);
    if (error) return sendError(res, error.details[0].message, 'VALIDATION_ERROR', 400);

    const { search, grade, minPrice, maxPrice, organic, category, page, limit, district, state } = q;

    const filter = { status: 'active' };
    if (search) filter.$text = { $search: search };
    if (grade) filter.aiGrade = grade.toUpperCase();
    if (category) filter.category = category;
    if (organic === 'true') filter.isOrganic = true;
    if (district) filter['location.district'] = new RegExp(escapeRegex(district), 'i');
    if (state) filter['location.state'] = new RegExp(escapeRegex(state), 'i');
    if (minPrice || maxPrice) {
      filter.expectedPrice = {};
      if (minPrice) filter.expectedPrice.$gte = minPrice;
      if (maxPrice) filter.expectedPrice.$lte = maxPrice;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('farmerId', 'farmLocation averageRating')
        .sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Listing.countDocuments(filter),
    ]);

    // Fire-and-forget view count increment
    Listing.updateMany(
      { _id: { $in: listings.map((l) => l._id) } },
      { $inc: { viewCount: 1 } }
    ).exec();

    return sendSuccess(res, {
      listings,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
      appliedFilters: { search, grade, category, organic, minPrice, maxPrice },
    }, `${total} listings found`);
  } catch (error) {
    console.error('[getListings - buyer]', error);
    return sendError(res, 'Failed to fetch listings', 'FETCH_LISTINGS_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Place a bid on a listing
// @route   POST /api/v1/buyer/listings/:id/bid
// @access  Private (buyer)
// ─────────────────────────────────────────────────────────
const placeBid = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) return sendError(res, 'Buyer profile not found', 'BUYER_NOT_FOUND', 404);

    const listing = await Listing.findById(req.params.id);
    if (!listing) return sendError(res, 'Listing not found', 'LISTING_NOT_FOUND', 404);
    if (listing.status !== 'active') {
      return sendError(res, `Listing not available (status: ${listing.status})`, 'LISTING_NOT_AVAILABLE', 400);
    }

    const { bidPrice, quantity, deliveryAddress, deliveryLocation, expectedDeliveryDate } = req.body;

    if (quantity > listing.quantity) {
      return sendError(res, `Quantity (${quantity}) exceeds available (${listing.quantity} ${listing.unit})`, 'QUANTITY_EXCEEDED', 400);
    }

    const existingBid = await Order.findOne({ listingId: listing._id, buyerId: buyer._id, escrowState: 'BID_PLACED' });
    if (existingBid) return sendError(res, 'You already placed a bid on this listing', 'DUPLICATE_BID', 409);

    const agreedPrice = bidPrice * quantity;
    const platformFee = Math.round(agreedPrice * 0.02);
    const freightCharge = calculateFreightEstimate(quantity, listing.unit);
    const totalAmount = agreedPrice + platformFee + freightCharge;

    const order = await Order.create({
      listingId: listing._id,
      buyerId: buyer._id,
      farmerId: listing.farmerId,
      agreedPrice, pricePerUnit: bidPrice, quantity, unit: listing.unit,
      freightCharge, platformFee, totalAmount,
      deliveryAddress,
      deliveryLocation: deliveryLocation || {},
      pickupAddress: listing.location?.district
        ? `${listing.location.district}, ${listing.location.state}`
        : 'Farmer location',
      pickupLocation: { lat: listing.location?.lat, lng: listing.location?.lng },
      expectedDeliveryDate: expectedDeliveryDate || null,
      escrowState: 'BID_PLACED',
    });

    return sendSuccess(res, {
      order,
      bidSummary: { pricePerUnit: bidPrice, quantity, unit: listing.unit, agreedPrice, platformFee, freightCharge, totalAmount },
    }, 'Bid placed! Waiting for farmer to accept.', 201);
  } catch (error) {
    console.error('[placeBid]', error);
    return sendError(res, 'Failed to place bid', 'PLACE_BID_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get buyer's demand requests
// @route   GET /api/v1/buyer/demand
// @access  Private (buyer)
// ─────────────────────────────────────────────────────────
const getDemands = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    const demands = await DemandRequest.find({ buyerId: buyer._id }).sort('-createdAt');
    return sendSuccess(res, demands, 'Demand requests fetched');
  } catch (error) {
    console.error('[getDemands]', error);
    return sendError(res, 'Failed to fetch demands', 'FETCH_DEMANDS_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Create a demand / reverse auction request
// @route   POST /api/v1/buyer/demand
// @access  Private (buyer)
// ─────────────────────────────────────────────────────────
const createDemand = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) return sendError(res, 'Buyer profile not found', 'BUYER_NOT_FOUND', 404);

    const demand = await DemandRequest.create({ buyerId: buyer._id, ...req.body });
    return sendSuccess(res, demand, 'Demand request posted. Farmers will respond shortly.', 201);
  } catch (error) {
    console.error('[createDemand]', error);
    return sendError(res, 'Failed to create demand', 'CREATE_DEMAND_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get buyer's order history (paginated)
// @route   GET /api/v1/buyer/orders
// @access  Private (buyer)
// ─────────────────────────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) return sendError(res, 'Buyer profile not found', 'BUYER_NOT_FOUND', 404);

    const { status, page = 1, limit = 10 } = req.query;
    const filter = { buyerId: buyer._id };
    if (status) filter.escrowState = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('listingId', 'productName images unit aiGrade')
        .populate('farmerId', 'farmLocation averageRating')
        .populate('agencyId', 'agencyName')
        .sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    }, 'Orders fetched');
  } catch (error) {
    console.error('[getOrders - buyer]', error);
    return sendError(res, 'Failed to fetch orders', 'FETCH_ORDERS_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Create Razorpay order → returns checkout details
// @route   POST /api/v1/buyer/orders/:id/pay
// @access  Private (buyer)
// ─────────────────────────────────────────────────────────
const initiatePayment = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    const order = await Order.findOne({ _id: req.params.id, buyerId: buyer._id, escrowState: 'PENDING_PAYMENT' });
    if (!order) return sendError(res, 'Order not found or not ready for payment', 'ORDER_NOT_FOUND', 404);

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: order.totalAmount * 100, // paise
        currency: 'INR',
        receipt: `order_${order._id}`,
        notes: { orderId: order._id.toString(), buyerId: buyer._id.toString() },
      });
    } catch (rzpErr) {
      console.error('[Razorpay Error]', rzpErr);
      const isAuthError = rzpErr.statusCode === 401;
      return sendError(
        res,
        isAuthError ? 'Payment gateway authentication failed. Please check server keys.' : 'Failed to create payment order',
        isAuthError ? 'PAYMENT_CONFIG_ERROR' : 'PAYMENT_GATEWAY_ERROR',
        isAuthError ? 401 : 502
      );
    }

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    await Payment.create({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      status: 'created',
    });

    return sendSuccess(res, {
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      amountInPaise: order.totalAmount * 100,
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      orderDetails: {
        agreedPrice: order.agreedPrice,
        platformFee: order.platformFee,
        freightCharge: order.freightCharge,
        totalAmount: order.totalAmount,
      },
    }, 'Payment initiated. Open Razorpay checkout on frontend.');
  } catch (error) {
    console.error('[initiatePayment]', error);
    return sendError(res, 'Failed to initiate payment', 'PAYMENT_INIT_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Buyer verifies delivery — AI scan → escrow release
// @route   POST /api/v1/buyer/verify-delivery
// @access  Private (buyer)
// Body: { orderId, imageBase64? }
// ─────────────────────────────────────────────────────────
const verifyDelivery = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    const { orderId, imageBase64 } = req.body;

    if (!orderId) return sendError(res, 'orderId is required', 'MISSING_ORDER_ID', 400);

    const order = await Order.findOne({ _id: orderId, buyerId: buyer._id, escrowState: 'DELIVERED' });
    if (!order) return sendError(res, 'Order not found or not in DELIVERED state', 'ORDER_NOT_FOUND', 404);

    // Fetch listing AI scan score for comparison
    const listingScan = await AIScan.findOne({ listingId: order.listingId, scanType: 'LISTING' });
    const listingAiScore = listingScan?.aiScore || 80;

    // Run delivery AI scan (Phase 5: real image; Phase 2-4: mock)
    const deliveryResult = await gradeQuality(imageBase64 || null);
    const deliveryAiScore = deliveryResult.score;
    const qualityRatio = deliveryAiScore / listingAiScore;

    // Store DELIVERY AIScan record
    const deliveryScan = await AIScan.create({
      orderId: order._id,
      listingId: order.listingId,
      scanType: 'DELIVERY',
      aiGrade: deliveryResult.grade,
      aiScore: deliveryAiScore,
      matchScore: Math.round(qualityRatio * 100),
      qualityRatio,
      scannedBy: req.user._id,
      blockchainTxHash: `mock_delivery_${order._id}`,
    });

    // ── Call Escrow Settlement Engine ─────────────────────
    const settlement = await releaseEscrow(orderId, deliveryAiScore, listingAiScore);

    // ── Trigger Background Trust Proof (Blockchain/IPFS) ──
    runTrustVerification(orderId, imageBase64, 'DELIVERY', req.user._id, deliveryScan._id)
      .catch(err => console.error('Background trust proof failed:', err));

    return sendSuccess(res, {
      deliveryScan,
      settlement,
    }, `✅ Delivery verified. ${settlement.message}`);
  } catch (error) {
    console.error('[verifyDelivery]', error);
    return sendError(res, 'Failed to verify delivery', 'DELIVERY_VERIFY_FAILED', 500);
  }
};


module.exports = {
  getListings,
  placeBid,
  getDemands,
  createDemand,
  getOrders,
  initiatePayment,
  verifyDelivery,
};
