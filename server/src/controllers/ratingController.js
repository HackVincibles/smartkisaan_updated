const Rating = require('../models/Rating');
const Order = require('../models/Order');
const Farmer = require('../models/Farmer');
const TransportAgency = require('../models/TransportAgency');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// ── Helper: Re-calc average scores for the profile ────────
const recalculateProfileRating = async (rateeId, modelType) => {
  try {
    const stats = await Rating.aggregate([
      { $match: { rateeId } },
      {
        $group: {
          _id: null,
          average: { $avg: "$score" },
          total: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      const { average, total } = stats[0];
      const finalAvg = parseFloat(average.toFixed(2));

      // Update relevant profile depending on type
      if (modelType === 'farmer') {
        await Farmer.findOneAndUpdate({ userId: rateeId }, { averageRating: finalAvg, totalRatings: total });
      } else if (modelType === 'transport') {
        await TransportAgency.findOneAndUpdate({ userId: rateeId }, { averageRating: finalAvg, totalRatings: total });
      }
      
      // Standardize global user trust score (Base score of 50 + calculated dynamic boost)
      const newTrustScore = Math.min(100, Math.round(50 + (finalAvg * 10)));
      await User.findByIdAndUpdate(rateeId, { trustScore: newTrustScore });
    }
  } catch (err) {
    console.error('Profile recaculation failed silently:', err.message);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Create a rating for an order
// ─────────────────────────────────────────────────────────
const createRating = async (req, res) => {
  try {
    const { orderId, rateeId, score, review, roleContext } = req.body;
    const raterId = req.user._id;

    if (!orderId || !rateeId || !score || !roleContext) {
      return sendError(res, 'Fill all mandatory fields', 'VALIDATION_ERR', 400);
    }

    // 1. Security Check: Verify that user was involved in this order
    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 'Invalid Order Reference', 'NOT_FOUND', 404);

    // 2. Store user rating
    const newRating = await Rating.create({
      orderId,
      raterId,
      rateeId,
      score,
      review,
      roleContext
    });

    // 3. Perform background calculation based on role context target
    let typeToUpdate = 'user';
    if (roleContext === 'BUYER_RATES_FARMER') typeToUpdate = 'farmer';
    if (typeof roleContext === 'string' && roleContext.includes('TRANSPORTER')) typeToUpdate = 'transport';

    // Trigger non-blocking calc
    recalculateProfileRating(rateeId, typeToUpdate);

    return sendSuccess(res, newRating, 'Thank you for the feedback! Rating recorded securely.');
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, 'Duplicate entry: You have already reviewed this transaction context.', 'DUPLICATE', 400);
    }
    console.error('[createRating]', err);
    return sendError(res, 'Rating failed to process', 'SERVER_ERR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all reviews targetted at a user (Public View)
// ─────────────────────────────────────────────────────────
const getTargetedReviews = async (req, res) => {
  try {
    const targetId = req.params.userId;
    const feedbackList = await Rating.find({ rateeId: targetId })
      .populate('raterId', 'name profilePhoto')
      .sort('-createdAt');

    return sendSuccess(res, feedbackList, 'Public reviews fetched successfully.');
  } catch (err) {
    return sendError(res, 'Unable to pull feed', 'ERR', 500);
  }
};

module.exports = {
  createRating,
  getTargetedReviews
};
