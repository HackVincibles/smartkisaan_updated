const Order = require('../models/Order');
const TransportAgency = require('../models/TransportAgency');
const AIScan = require('../models/AIScan');

const { sendSuccess, sendError } = require('../utils/responseHelper');
const { generateQR, verifyQR } = require('../services/logisticsService');
const { gradeQuality } = require('../services/aiService');
const { setEx, get } = require('../config/redis');
const { emitLocationUpdate } = require('../config/socket');

// ─────────────────────────────────────────────────────────
// @desc    Get logistics dashboard stats
// @route   GET /api/v1/logistics/dashboard
// @access  Private (transport)
// ─────────────────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const agency = await TransportAgency.findOne({ userId: req.user._id });
    if (!agency) return sendError(res, 'Agency not found', 'AGENCY_NOT_FOUND', 404);

    const stats = await Order.aggregate([
      { $match: { agencyId: agency._id } },
      { $group: { _id: '$escrowState', count: { $sum: 1 } } },
    ]);

    const counts = {
      assigned: 0,
      picked_up: 0,
      in_transit: 0,
      delivered: 0,
      completed: 0,
    };

    stats.forEach((s) => {
      if (s._id === 'PICKUP_ASSIGNED') counts.assigned = s.count;
      if (s._id === 'PICKED_UP') counts.picked_up = s.count;
      if (s._id === 'IN_TRANSIT') counts.in_transit = s.count;
      if (s._id === 'DELIVERED') counts.delivered = s.count;
      if (s._id === 'COMPLETED') counts.completed = s.count;
    });

    return sendSuccess(res, {
      agency,
      stats: counts,
      activeOrdersCount: agency.activeOrders?.length || 0,
      totalEarnings: agency.totalEarnings || 0,
    }, 'Logistics dashboard loaded');
  } catch (error) {
    console.error('[getDashboard - logistics]', error);
    return sendError(res, 'Failed to load dashboard', 'DASHBOARD_ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all orders assigned to this transport agency
// @route   GET /api/v1/logistics/assigned-orders
// @access  Private (transport)
// ─────────────────────────────────────────────────────────
const getAssignedOrders = async (req, res) => {
  try {
    const agency = await TransportAgency.findOne({ userId: req.user._id });
    if (!agency) return sendError(res, 'Transport agency profile not found', 'AGENCY_NOT_FOUND', 404);

    const { status, page = 1, limit = 10 } = req.query;

    const filter = {
      agencyId: agency._id,
      escrowState: { $in: ['PICKUP_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'] },
    };
    if (status) filter.escrowState = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('listingId', 'productName images unit quantity category')
        .populate('farmerId', 'farmLocation')
        .populate('buyerId', 'address businessName')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    }, `${total} assigned order(s) found`);
  } catch (error) {
    console.error('[getAssignedOrders]', error);
    return sendError(res, 'Failed to fetch assigned orders', 'FETCH_ORDERS_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Accept an assigned order
// @route   POST /api/v1/logistics/orders/:id/accept
// @access  Private (transport)
// ─────────────────────────────────────────────────────────
const acceptOrder = async (req, res) => {
  try {
    const agency = await TransportAgency.findOne({ userId: req.user._id });
    if (!agency) return sendError(res, 'Agency not found', 'AGENCY_NOT_FOUND', 404);

    const order = await Order.findOne({
      _id: req.params.id,
      agencyId: agency._id,
      escrowState: 'PICKUP_ASSIGNED',
    });

    if (!order) return sendError(res, 'Order not found or cannot be accepted', 'ORDER_NOT_FOUND', 404);

    // Add to agency active orders
    await TransportAgency.findByIdAndUpdate(agency._id, {
      $addToSet: { activeOrders: order._id },
    });

    return sendSuccess(res, { order }, 'Order accepted. Proceed to pickup location.');
  } catch (error) {
    console.error('[acceptOrder]', error);
    return sendError(res, 'Failed to accept order', 'ACCEPT_ORDER_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Confirm pickup by scanning Farmer QR
// @route   POST /api/v1/logistics/orders/:id/pickup
// @access  Private (transport)
//
// Body: { qrData: "<scanned QR string>", imageBase64?: "<photo for AI scan>" }
//
// Security: QR hash verified + agencyId device-lock check
// AI: gradeQuality() runs pickup scan, stores AIScan(PICKUP)
// State: PICKUP_ASSIGNED → PICKED_UP
// ─────────────────────────────────────────────────────────
const confirmPickup = async (req, res) => {
  try {
    const agency = await TransportAgency.findOne({ userId: req.user._id });
    if (!agency) return sendError(res, 'Agency not found', 'AGENCY_NOT_FOUND', 404);

    const order = await Order.findOne({
      _id: req.params.id,
      escrowState: { $in: ['PICKUP_ASSIGNED', 'PAID_ESCROW'] },
    });

    if (!order) return sendError(res, 'Order not found or not ready for pickup', 'ORDER_NOT_FOUND', 404);

    const { qrData, imageBase64 } = req.body;

    if (!qrData) return sendError(res, 'QR scan data is required', 'QR_DATA_MISSING', 400);

    // ── QR Verification ───────────────────────────────────
    const qrCheck = await verifyQR(qrData, order._id, agency._id);

    if (!qrCheck.valid) {
      return sendError(res, qrCheck.error, qrCheck.code, 403);
    }

    // ── AI Pickup Scan ────────────────────────────────────
    const qualityResult = await gradeQuality(imageBase64 || null);

    // Fetch listing scan to calculate match ratio
    const listingScan = await AIScan.findOne({ listingId: order.listingId, scanType: 'LISTING' });
    const listingAiScore = listingScan?.aiScore || 80;
    const matchScore = Math.min(100, Math.round((qualityResult.score / listingAiScore) * 100));

    const pickupScan = await AIScan.create({
      orderId: order._id,
      listingId: order.listingId,
      scanType: 'PICKUP',
      aiGrade: qualityResult.grade,
      aiScore: qualityResult.score,
      matchScore,
      qualityRatio: qualityResult.score / listingAiScore,
      scannedBy: req.user._id,
      blockchainTxHash: `mock_pickup_${order._id}`,
    });

    // ── State Transition ──────────────────────────────────
    order.escrowState = 'PICKED_UP';
    order.pickedUpAt = new Date();
    order.actualPickupTime = new Date();
    await order.save();

    return sendSuccess(res, {
      order,
      pickupScan,
      aiResult: {
        grade: qualityResult.grade,
        score: qualityResult.score,
        matchScore,
        details: qualityResult.details,
      },
    }, `Pickup confirmed! AI Grade: ${qualityResult.grade} (${qualityResult.score}/100). Proceed to delivery.`);
  } catch (error) {
    console.error('[confirmPickup]', error);
    return sendError(res, 'Failed to confirm pickup', 'PICKUP_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Confirm delivery by scanning Buyer QR
// @route   POST /api/v1/logistics/orders/:id/delivery
// @access  Private (transport)
//
// Body: { qrData: "<scanned QR string>", imageBase64?: "<photo>" }
//
// Security: QR hash verified + agencyId device-lock check
// State: PICKED_UP / IN_TRANSIT → DELIVERED
// Triggers escrow release flow (Phase 4)
// ─────────────────────────────────────────────────────────
const confirmDelivery = async (req, res) => {
  try {
    const agency = await TransportAgency.findOne({ userId: req.user._id });
    if (!agency) return sendError(res, 'Agency not found', 'AGENCY_NOT_FOUND', 404);

    const order = await Order.findOne({
      _id: req.params.id,
      agencyId: agency._id,
      escrowState: { $in: ['PICKED_UP', 'IN_TRANSIT'] },
    });

    if (!order) return sendError(res, 'Order not found or not ready for delivery', 'ORDER_NOT_FOUND', 404);

    const { qrData, imageBase64 } = req.body;

    if (!qrData) return sendError(res, 'QR scan data is required', 'QR_DATA_MISSING', 400);

    // ── QR Verification ───────────────────────────────────
    const qrCheck = await verifyQR(qrData, order._id, agency._id);

    if (!qrCheck.valid) {
      return sendError(res, qrCheck.error, qrCheck.code, 403);
    }

    // ── State Transition ──────────────────────────────────
    order.escrowState = 'DELIVERED';
    order.deliveredAt = new Date();
    order.actualDeliveryTime = new Date();
    await order.save();

    // ── Clear live location from Redis ────────────────────
    await setEx(`location:${order._id}`, 1, JSON.stringify({ status: 'DELIVERED' }));

    // ── Emit final location event to all watchers ─────────
    emitLocationUpdate(order._id.toString(), {
      status: 'DELIVERED',
      message: 'Order delivered successfully',
    });

    // ── Update agency stats ───────────────────────────────
    await TransportAgency.findByIdAndUpdate(agency._id, {
      $pull: { activeOrders: order._id },
      $inc: { completedOrders: 1 },
    });

    return sendSuccess(res, {
      order,
      message: 'Delivery confirmed! Buyer will now verify quality and escrow will be released.',
      nextStep: 'Buyer must run verify-delivery scan to trigger payment settlement.',
    }, 'Delivery confirmed successfully.');
  } catch (error) {
    console.error('[confirmDelivery]', error);
    return sendError(res, 'Failed to confirm delivery', 'DELIVERY_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Update live GPS location of transporter
// @route   POST /api/v1/logistics/location
// @access  Private (transport)
//
// Body: { orderId, lat, lng }
// Stores in Redis (TTL 1h) + emits via Socket.io to order room
// ─────────────────────────────────────────────────────────
const updateLocation = async (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;

    if (!orderId || lat === undefined || lng === undefined) {
      return sendError(res, 'orderId, lat, and lng are required', 'MISSING_LOCATION_DATA', 400);
    }

    const agency = await TransportAgency.findOne({ userId: req.user._id });
    if (!agency) return sendError(res, 'Agency not found', 'AGENCY_NOT_FOUND', 404);

    // Verify agency is assigned to this order
    const order = await Order.findOne({
      _id: orderId,
      agencyId: agency._id,
      escrowState: { $in: ['PICKED_UP', 'IN_TRANSIT'] },
    });

    if (!order) return sendError(res, 'Order not found or not in transit', 'ORDER_NOT_IN_TRANSIT', 404);

    // Auto-transition to IN_TRANSIT on first location update after pickup
    if (order.escrowState === 'PICKED_UP') {
      order.escrowState = 'IN_TRANSIT';
      await order.save();
    }

    const locationData = {
      orderId,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      status: 'IN_TRANSIT',
      timestamp: new Date().toISOString(),
      agencyId: agency._id,
      agencyName: agency.agencyName,
    };

    // Store in Redis (1 hour TTL)
    await setEx(`location:${orderId}`, 3600, JSON.stringify(locationData));

    // Emit to all Socket.io clients in this order's room
    emitLocationUpdate(orderId, locationData);

    // Update agency current location
    await TransportAgency.findByIdAndUpdate(agency._id, {
      'currentLocation.lat': parseFloat(lat),
      'currentLocation.lng': parseFloat(lng),
      'currentLocation.updatedAt': new Date(),
    });

    return sendSuccess(res, locationData, 'Location updated');
  } catch (error) {
    console.error('[updateLocation]', error);
    return sendError(res, 'Failed to update location', 'LOCATION_UPDATE_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get last known location of transporter for an order
// @route   GET /api/v1/logistics/orders/:id/location
// @access  Private (farmer, buyer, transport, admin)
// ─────────────────────────────────────────────────────────
const getLocation = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const cached = await get(`location:${orderId}`);
    if (!cached) {
      return sendError(res, 'No live location available for this order yet', 'LOCATION_NOT_FOUND', 404);
    }

    return sendSuccess(res, JSON.parse(cached), 'Last known location fetched');
  } catch (error) {
    console.error('[getLocation]', error);
    return sendError(res, 'Failed to get location', 'GET_LOCATION_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Generate QR codes for an order (called after payment)
// @route   POST /api/v1/logistics/orders/:id/generate-qr
// @access  Private (admin or system — called internally after payment)
// ─────────────────────────────────────────────────────────
const generateOrderQRs = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 'Order not found', 'ORDER_NOT_FOUND', 404);
    if (order.escrowState !== 'PAID_ESCROW') {
      return sendError(res, 'QR can only be generated after payment is confirmed', 'INVALID_STATE', 400);
    }

    const [farmerQR, buyerQR] = await Promise.all([
      generateQR(order._id, 'farmer'),
      generateQR(order._id, 'buyer'),
    ]);

    order.farmerQR = farmerQR;
    order.buyerQR = buyerQR;
    await order.save();

    return sendSuccess(res, {
      farmerQR,
      buyerQR,
      orderId: order._id,
      instruction: {
        farmer: 'Show farmerQR to transporter at pickup',
        buyer: 'Show buyerQR to transporter at delivery',
      },
    }, 'QR codes generated successfully');
  } catch (error) {
    console.error('[generateOrderQRs]', error);
    return sendError(res, 'Failed to generate QR codes', 'QR_GENERATION_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all orders waiting for a transporter
// @route   GET /api/v1/logistics/available-loads
// @access  Private (transport)
// ─────────────────────────────────────────────────────────
const getAvailableLoads = async (req, res) => {
  try {
    const { page = 1, limit = 10, city } = req.query;

    const filter = {
      agencyId: null,
      escrowState: 'PAID_ESCROW',
    };

    // Optional city filter based on pickupAddress
    if (city) {
      filter.pickupAddress = { $regex: city, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('listingId', 'productName images unit quantity category')
        .populate('farmerId', 'name farmLocation')
        .populate('buyerId', 'businessName')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    }, `${total} available load(s) found`);
  } catch (error) {
    console.error('[getAvailableLoads]', error);
    return sendError(res, 'Failed to fetch available loads', 'FETCH_LOADS_FAILED', 500);
  }
};

module.exports = {
  getDashboard,
  getAssignedOrders,
  getAvailableLoads,
  acceptOrder,
  confirmPickup,
  confirmDelivery,
  updateLocation,
  getLocation,
  generateOrderQRs,
};
