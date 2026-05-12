const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    raisedByRole: { type: String, enum: ['farmer', 'buyer'], required: true },

    reason: { type: String, required: true, trim: true },
    reasonCode: {
      type: String,
      enum: [
        'QUALITY_MISMATCH',
        'QUANTITY_MISMATCH',
        'LATE_DELIVERY',
        'NO_DELIVERY',
        'WRONG_PRODUCT',
        'DAMAGED_PRODUCT',
        'PAYMENT_ISSUE',
        'OTHER',
      ],
      default: 'OTHER',
    },

    // AI-based verdict from rules engine
    aiVerdict: {
      type: String,
      enum: ['FULL_REFUND', 'PARTIAL_REFUND', 'NO_REFUND', 'ESCALATE_TO_ARBITRATOR', 'PENDING'],
      default: 'PENDING',
    },
    aiVerdictReason: { type: String, default: null },

    // Evidence: AI scan scores at the time of dispute
    listingAiScore: { type: Number, default: null },
    pickupAiScore: { type: Number, default: null },
    deliveryAiScore: { type: Number, default: null },

    resolution: { type: String, default: null },
    status: {
      type: String,
      enum: ['open', 'ai_resolved', 'accepted', 'escalated', 'closed'],
      default: 'open',
    },

    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispute', disputeSchema);
