const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const AIScan = require('../models/AIScan');

const { sendSuccess, sendError } = require('../utils/responseHelper');
const { verifyRazorpaySignature, releaseEscrow } = require('../services/escrowService');
const { generateQR } = require('../services/logisticsService');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/config');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────
// @desc    Create a Razorpay order (buyer initiates checkout)
// @route   POST /api/v1/payments/create-order
// @access  Private (buyer)
// Body: { orderId }
// ─────────────────────────────────────────────────────────
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return sendError(res, 'orderId is required', 'MISSING_ORDER_ID', 400);

    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 'Order not found', 'ORDER_NOT_FOUND', 404);
    if (order.escrowState !== 'PENDING_PAYMENT') {
      return sendError(res, `Order is not awaiting payment (state: ${order.escrowState})`, 'INVALID_ORDER_STATE', 400);
    }

    // Create Razorpay order (amount in paise = INR × 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      receipt: `sk_${order._id}`,
      notes: {
        smartkisanOrderId: order._id.toString(),
        buyerId: order.buyerId.toString(),
        farmerId: order.farmerId.toString(),
      },
    });

    // Store Razorpay order ID in Order doc
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    // Upsert Payment doc
    await Payment.findOneAndUpdate(
      { orderId: order._id },
      {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        status: 'created',
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, {
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      amountInPaise: Math.round(order.totalAmount * 100),
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      prefill: {
        name: 'Buyer Name',     // Frontend should populate from user profile
        email: '',
        contact: '',
      },
      breakdown: {
        productPrice: order.agreedPrice,
        platformFee: order.platformFee,
        freightCharge: order.freightCharge,
        total: order.totalAmount,
      },
    }, 'Razorpay order created. Open checkout on frontend.');
  } catch (error) {
    console.error('[createRazorpayOrder]', error);
    return sendError(res, 'Failed to create payment order', 'RAZORPAY_ORDER_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Verify Razorpay payment + generate QR codes
// @route   POST /api/v1/payments/verify
// @access  Public (called by Razorpay or frontend after payment)
//
// Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
//
// Flow:
//   1. Verify HMAC signature (tamper-proof)
//   2. Update Order escrowState → PAID_ESCROW
//   3. Generate farmer QR + buyer QR
//   4. Store QRs in Order doc
//   5. Update Payment doc status → captured
// ─────────────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return sendError(res, 'razorpayOrderId, razorpayPaymentId, and razorpaySignature are all required', 'MISSING_PAYMENT_DATA', 400);
    }

    // ── Step 1: Verify HMAC signature ─────────────────────
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      console.warn(`[verifyPayment] Invalid signature for order ${razorpayOrderId}`);
      return sendError(res, 'Payment signature verification failed. Possible fraud.', 'SIGNATURE_INVALID', 400);
    }

    // ── Step 2: Find the SmartKisan order ─────────────────
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return sendError(res, 'Order not found for this Razorpay order ID', 'ORDER_NOT_FOUND', 404);
    }

    if (order.escrowState !== 'PENDING_PAYMENT') {
      // Idempotent — already processed
      return sendSuccess(res, { orderId: order._id, escrowState: order.escrowState }, 'Payment already processed');
    }

    // ── Step 3: Generate HMAC-signed QR codes ─────────────
    const [farmerQR, buyerQR] = await Promise.all([
      generateQR(order._id, 'farmer'),
      generateQR(order._id, 'buyer'),
    ]);

    // ── Step 4: Update Order ───────────────────────────────
    order.escrowState = 'PAID_ESCROW';
    order.razorpayPaymentId = razorpayPaymentId;
    order.farmerQR = farmerQR;
    order.buyerQR = buyerQR;
    order.paymentDoneAt = new Date();
    await order.save();

    // ── Step 5: Update Payment doc ────────────────────────
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'captured',
      },
      { new: true }
    );

    return sendSuccess(res, {
      orderId: order._id,
      escrowState: order.escrowState,
      farmerQR,   // Farmer shows this to transporter at pickup
      buyerQR,    // Buyer shows this to transporter at delivery
      message: 'Payment confirmed. QR codes generated. Transporter will be assigned shortly.',
    }, '✅ Payment verified and held in escrow');
  } catch (error) {
    console.error('[verifyPayment]', error);
    return sendError(res, 'Payment verification failed', 'PAYMENT_VERIFY_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Manually trigger escrow release (admin or system)
// @route   POST /api/v1/payments/release-escrow
// @access  Private (admin)
// Body: { orderId }
//
// Normally called automatically by buyer's verify-delivery.
// This endpoint allows admin override for edge cases.
// ─────────────────────────────────────────────────────────
const triggerEscrowRelease = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return sendError(res, 'orderId is required', 'MISSING_ORDER_ID', 400);

    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 'Order not found', 'ORDER_NOT_FOUND', 404);

    if (!['DELIVERED', 'DISPUTED'].includes(order.escrowState)) {
      return sendError(
        res,
        `Cannot release escrow for order in state: ${order.escrowState}`,
        'INVALID_ORDER_STATE',
        400
      );
    }

    // Fetch AI scan scores
    const [listingScan, deliveryScan] = await Promise.all([
      AIScan.findOne({ listingId: order.listingId, scanType: 'LISTING' }),
      AIScan.findOne({ orderId: order._id, scanType: 'DELIVERY' }),
    ]);

    const listingAiScore = listingScan?.aiScore || 80;
    const deliveryAiScore = deliveryScan?.aiScore || 80;

    const result = await releaseEscrow(orderId, deliveryAiScore, listingAiScore);

    return sendSuccess(res, result, `Escrow released. Basis: ${result.settlementBasis}`);
  } catch (error) {
    console.error('[triggerEscrowRelease]', error);
    return sendError(res, error.message || 'Escrow release failed', 'ESCROW_RELEASE_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get current escrow state and payment breakdown
// @route   GET /api/v1/payments/balance/:orderId
// @access  Private (farmer, buyer, admin)
// ─────────────────────────────────────────────────────────
const getEscrowBalance = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [order, payment] = await Promise.all([
      Order.findById(orderId).select('escrowState totalAmount agreedPrice freightCharge platformFee razorpayOrderId'),
      Payment.findOne({ orderId }),
    ]);

    if (!order) return sendError(res, 'Order not found', 'ORDER_NOT_FOUND', 404);

    return sendSuccess(res, {
      orderId,
      escrowState: order.escrowState,
      totalHeld: order.totalAmount,
      breakdown: {
        agreedPrice: order.agreedPrice,
        freightCharge: order.freightCharge,
        platformFee: order.platformFee,
        totalAmount: order.totalAmount,
      },
      settlement: payment ? {
        status: payment.status,
        farmerAmount: payment.farmerAmount,
        transporterAmount: payment.transporterAmount,
        buyerRefund: payment.buyerRefund,
        platformRevenue: payment.platformRevenue,
        settlementBasis: payment.settlementBasis,
        settledAt: payment.settledAt,
        qualityRatio: payment.qualityRatio,
      } : null,
    }, 'Escrow balance fetched');
  } catch (error) {
    console.error('[getEscrowBalance]', error);
    return sendError(res, 'Failed to get escrow balance', 'GET_BALANCE_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get payment history for an order
// @route   GET /api/v1/payments/history/:orderId
// @access  Private
// ─────────────────────────────────────────────────────────
const getPaymentHistory = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId })
      .populate('orderId', 'escrowState totalAmount agreedPrice');

    if (!payment) return sendError(res, 'No payment record found', 'PAYMENT_NOT_FOUND', 404);

    return sendSuccess(res, payment, 'Payment history fetched');
  } catch (error) {
    console.error('[getPaymentHistory]', error);
    return sendError(res, 'Failed to fetch payment history', 'FETCH_PAYMENT_FAILED', 500);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  triggerEscrowRelease,
  getEscrowBalance,
  getPaymentHistory,
};
