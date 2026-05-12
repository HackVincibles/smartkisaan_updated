const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },

    // Total amount captured in escrow (INR paise for Razorpay, INR rupees for display)
    amount: { type: Number, required: true }, // in INR (rupees)

    // Settlement breakdown (calculated after delivery AI scan)
    farmerAmount: { type: Number, default: null },
    transporterAmount: { type: Number, default: null },
    buyerRefund: { type: Number, default: 0 },
    platformRevenue: { type: Number, default: null },

    // AI settlement details
    listingAiScore: { type: Number, default: null },
    deliveryAiScore: { type: Number, default: null },
    qualityRatio: { type: Number, default: null },
    settlementBasis: {
      type: String,
      enum: ['FULL_RELEASE', 'PARTIAL_REFUND', 'FULL_REFUND', 'PENDING'],
      default: 'PENDING',
    },

    status: {
      type: String,
      enum: ['created', 'captured', 'settled', 'refunded', 'failed'],
      default: 'created',
    },

    settledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
