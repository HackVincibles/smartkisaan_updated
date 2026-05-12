const User = require('../models/User');
const Order = require('../models/Order');
const Listing = require('../models/Listing');
const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// ─────────────────────────────────────────────────────────
// @desc    High-level aggregate dashboard overview
// ─────────────────────────────────────────────────────────
const getGlobalStats = async (req, res) => {
  try {
    // 1. User segmentation
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // 2. Market volume & Platform profit
    const financialStats = await Payment.aggregate([
      { $match: { status: 'CAPTURED' } },
      {
        $group: {
          _id: null,
          grossMarketValue: { $sum: '$amount' },
          platformCommission: { $sum: '$platformFee' }
        }
      }
    ]);

    // 3. Listing & Crop breakdown
    const listingCounts = await Listing.countDocuments();
    const popularCrops = await Listing.aggregate([
      { $group: { _id: '$cropType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 4. Active vs Completed orders
    const activeOrders = await Order.countDocuments({ escrowState: { $in: ['PAID_ESCROW', 'PICKED_UP', 'DELIVERED'] } });
    const finishedOrders = await Order.countDocuments({ escrowState: 'COMPLETED' });

    return sendSuccess(res, {
      users: userStats,
      financials: financialStats[0] || { grossMarketValue: 0, platformCommission: 0 },
      inventory: { totalListings: listingCounts, activeOrders, finishedOrders },
      topCrops: popularCrops,
    }, 'Platform master intelligence payload generated.');
  } catch (err) {
    console.error('[getGlobalStats]', err);
    return sendError(res, 'Failed to load aggregate intelligence', 'SERVER_ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    View internal audit trails system actions
// ─────────────────────────────────────────────────────────
const getAuditTrails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    return sendSuccess(res, logs, 'System trails accessed.');
  } catch (err) {
    return sendError(res, 'Query failed', 'DB_ERR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Lock/Ban user account
// ─────────────────────────────────────────────────────────
const toggleUserSuspension = async (req, res) => {
  try {
    const { targetId, isBanned } = req.body;
    const update = await User.findByIdAndUpdate(
      targetId,
      { isActive: !isBanned },
      { new: true }
    );

    if (!update) return sendError(res, 'User not found', 'NOT_FOUND', 404);

    // Push entry into audit log
    await AuditLog.create({
      action: isBanned ? 'USER_BANNED' : 'USER_UNBANNED',
      performedBy: req.user._id,
      targetId: targetId,
      details: `Account status toggled by admin.`
    });

    return sendSuccess(res, update, `User account has been ${isBanned ? 'suspended' : 'reactivated'}.`);
  } catch (err) {
    return sendError(res, 'Toggle operation failed', 'INTERNAL', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    View all users (paginated)
// @route   GET /api/v1/admin/users
// ─────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return sendSuccess(res, { users, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'User list fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch users', 'DB_ERR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    View listings pending admin approval
// @route   GET /api/v1/admin/listings/review
// ─────────────────────────────────────────────────────────
const getPendingListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'pending' }).populate('farmerId', 'name phone');
    return sendSuccess(res, listings, 'Pending listings fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch', 'ERR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Approve or Reject a listing
// @route   POST /api/v1/admin/listings/:id/approve
// ─────────────────────────────────────────────────────────
const approveListing = async (req, res) => {
  try {
    const { decision } = req.body; // 'approve' or 'reject'
    const listing = await Listing.findById(req.params.id);
    if (!listing) return sendError(res, 'Listing not found', 'NOT_FOUND', 404);

    listing.status = decision === 'approve' ? 'active' : 'rejected';
    await listing.save();

    const actionType = typeof decision === 'string' ? decision.toUpperCase() : 'UNKNOWN';
    await AuditLog.create({
      action: `LISTING_${actionType}`,
      performedBy: req.user._id,
      targetId: listing._id,
      details: `Listing status changed to ${listing.status}`
    });

    return sendSuccess(res, listing, `Listing ${decision}d successfully.`);
  } catch (err) {
    return sendError(res, 'Update failed', 'ERR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Send broadcast message to all users
// @route   POST /api/v1/admin/broadcast
// ─────────────────────────────────────────────────────────
const notify = require('../services/notificationService');
const broadcastNotification = async (req, res) => {
  try {
    const { title, message, role } = req.body;
    if (!title || !message) return sendError(res, 'Title and message required', 'MISSING_FIELDS', 400);

    const filter = role ? { role } : {};
    const users = await User.find(filter).select('phone email');

    // Async broadcast (Fire and forget)
    users.forEach(user => {
      notify.sendNotification(user._id, title, message, { type: 'BROADCAST' });
    });

    return sendSuccess(res, { recipientCount: users.length }, `Broadcast queued for ${users.length} users.`);
  } catch (err) {
    console.error('[broadcastNotification]', err);
    return sendError(res, 'Broadcast failed', 'ERR', 500);
  }
};

module.exports = {
  getGlobalStats,
  getAuditTrails,
  toggleUserSuspension,
  getUsers,
  getPendingListings,
  approveListing,
  broadcastNotification
};
