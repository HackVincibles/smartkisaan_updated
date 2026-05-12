const Dispute = require('../models/Dispute');
const Order = require('../models/Order');
const AIScan = require('../models/AIScan');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// ─────────────────────────────────────────────────────────
// @desc    Create a new Dispute against an Order
// @route   POST /api/v1/disputes/raise
// ─────────────────────────────────────────────────────────
const raiseDispute = async (req, res) => {
  try {
    const { orderId, reason, reasonCode } = req.body;
    if (!orderId || !reason) {
      return sendError(res, 'Order ID and reason text are required', 'MISSING_FIELDS', 400);
    }

    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 'Order not found', 'NOT_FOUND', 404);

    const existing = await Dispute.findOne({ orderId, raisedBy: req.user._id });
    if (existing) {
      return sendError(res, 'A dispute has already been submitted by you for this order', 'ALREADY_EXISTS', 409);
    }

    const [listingScan, pickupScan, deliveryScan] = await Promise.all([
      AIScan.findOne({ listingId: order.listingId, scanType: 'LISTING' }),
      AIScan.findOne({ orderId: order._id, scanType: 'PICKUP' }),
      AIScan.findOne({ orderId: order._id, scanType: 'DELIVERY' }),
    ]);

    const dispute = await Dispute.create({
      orderId,
      raisedBy: req.user._id,
      raisedByRole: req.user.role,
      reason,
      reasonCode: reasonCode || 'OTHER',
      listingAiScore: listingScan?.aiScore || null,
      pickupAiScore: pickupScan?.aiScore || null,
      deliveryAiScore: deliveryScan?.aiScore || null,
    });

    // AI Rule Engine Simulation
    let finalVerdict = 'ESCALATE_TO_ARBITRATOR';
    let reasonNotes = 'Complex drop detected. Requiring manual human arbitrator.';

    if (listingScan && deliveryScan) {
       const drop = listingScan.aiScore - deliveryScan.aiScore;
       if (drop < 5) {
          finalVerdict = 'NO_REFUND';
          reasonNotes = 'AI analysis confirms minimal quality drop. Condition matches listing description.';
       } else if (drop > 40) {
          finalVerdict = 'FULL_REFUND';
          reasonNotes = 'Severe visual degradation confirmed via cross-reference scans.';
       }
    }

    dispute.aiVerdict = finalVerdict;
    dispute.aiVerdictReason = reasonNotes;
    dispute.status = 'ai_resolved';
    await dispute.save();

    order.escrowState = 'DISPUTED';
    await order.save();

    return sendSuccess(res, dispute, 'Dispute lodged. AI audit assessment completed instantly.', 201);
  } catch (err) {
    console.error('[raiseDispute]', err);
    return sendError(res, 'Dispute lodgement failed internally', 'SERVER_ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get dispute status by ID
// @route   GET /api/v1/disputes/:id/status
// ─────────────────────────────────────────────────────────
const getDisputeStatus = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('orderId', 'totalAmount agreedPrice escrowState');
    if (!dispute) return sendError(res, 'Dispute not found', 'NOT_FOUND', 404);
    
    // Auth check: only raiser or admin
    if (dispute.raisedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized access to this dispute', 'UNAUTHORIZED', 403);
    }

    return sendSuccess(res, dispute, 'Dispute details fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch dispute', 'ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get AI resolution rules (JSON)
// @route   GET /api/v1/disputes/resolution-rules
// ─────────────────────────────────────────────────────────
const getResolutionRules = async (req, res) => {
  return sendSuccess(res, {
    rules: [
      { condition: 'Quality Drop < 5%', verdict: 'NO_REFUND', action: 'Release escrow to farmer' },
      { condition: 'Quality Drop 5-40%', verdict: 'PARTIAL_REFUND', action: 'Linear scaling refund to buyer' },
      { condition: 'Quality Drop > 40%', verdict: 'FULL_REFUND', action: 'Return funds to buyer' },
    ],
    engine: 'SmartKisan AI Arbiter v1.0',
    automatic: true
  }, 'AI Resolution rules fetched');
};

// ─────────────────────────────────────────────────────────
// @desc    Accept AI suggested resolution
// @route   POST /api/v1/disputes/accept-resolution
// ─────────────────────────────────────────────────────────
const acceptResolution = async (req, res) => {
  try {
    const { disputeId } = req.body;
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return sendError(res, 'Dispute not found', 'NOT_FOUND', 404);

    if (dispute.raisedBy.toString() !== req.user._id.toString()) {
      return sendError(res, 'Only the person who raised the dispute can accept resolution', 'UNAUTHORIZED', 403);
    }

    dispute.status = 'accepted';
    dispute.resolvedAt = new Date();
    await dispute.save();

    // Trigger escrow release
    await Order.findByIdAndUpdate(dispute.orderId, { escrowState: 'COMPLETED' });

    return sendSuccess(res, dispute, 'Resolution accepted. Funds will be settled based on AI verdict.');
  } catch (err) {
    return sendError(res, 'Failed to accept resolution', 'ERROR', 500);
  }
};

const getDisputeList = async (req, res) => {
  try {
    const disputes = await Dispute.find({ raisedBy: req.user._id })
      .populate('orderId', 'totalAmount agreedPrice pickupAddress deliveryAddress')
      .sort('-createdAt');
    return sendSuccess(res, disputes, 'Disputes fetched');
  } catch (err) {
    return sendError(res, 'Failed to load', 'ERROR', 500);
  }
};

const getAllDisputesAdmin = async (req, res) => {
  try {
    const adminList = await Dispute.find()
      .populate('raisedBy', 'name phone')
      .populate('orderId', 'totalAmount escrowState')
      .sort('-createdAt');
    return sendSuccess(res, adminList, 'Admin view loaded');
  } catch (err) {
    return sendError(res, 'Access error', 'INTERNAL', 500);
  }
};

const resolveDisputeAdmin = async (req, res) => {
  try {
    const { verdict, resolutionNotes } = req.body;
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) return sendError(res, 'Not found', 'NOT_FOUND', 404);

    dispute.status = 'closed';
    dispute.resolution = `Verdict: ${verdict}. Notes: ${resolutionNotes}`;
    dispute.acceptedBy = req.user._id;
    dispute.resolvedAt = new Date();
    await dispute.save();

    await Order.findByIdAndUpdate(dispute.orderId, { escrowState: 'COMPLETED' });

    return sendSuccess(res, dispute, 'Ticket marked as closed by human administrator.');
  } catch (err) {
    return sendError(res, 'Failed close', 'ERR', 500);
  }
};

module.exports = {
  raiseDispute,
  getDisputeList,
  getDisputeStatus,
  getResolutionRules,
  acceptResolution,
  getAllDisputesAdmin,
  resolveDisputeAdmin,
};
