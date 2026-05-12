const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    raterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rateeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, trim: true, default: null },
    // Context: who rated whom at which event
    roleContext: {
      type: String,
      enum: [
        'BUYER_RATES_FARMER',       // mandatory at delivery
        'BUYER_RATES_TRANSPORTER',  // mandatory at delivery
        'FARMER_RATES_TRANSPORTER', // mandatory at pickup
        'FARMER_RATES_BUYER',       // optional after order completion
      ],
      required: true,
    },
    isMandatory: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent duplicate ratings for same order + same rater + same ratee + same context
ratingSchema.index({ orderId: 1, raterId: 1, roleContext: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
