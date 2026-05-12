const mongoose = require('mongoose');

const aiScanSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null, // null for LISTING scans (no order yet); required for PICKUP/DELIVERY
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    // Which of the 3 scan events is this?
    scanType: {
      type: String,
      enum: ['LISTING', 'PICKUP', 'DELIVERY'],
      required: true,
    },
    // Image that was scanned
    imageUrl: { type: String, default: null },

    // AI output
    detectedCrop: { type: String, default: null },
    aiGrade: { type: String, enum: ['A', 'B', 'C', null], default: null },
    aiScore: { type: Number, min: 0, max: 100, default: null },
    shelfLifeDays: { type: Number, default: null },

    // Comparison vs LISTING scan (for PICKUP and DELIVERY)
    matchScore: { type: Number, min: 0, max: 100, default: null }, // (this_score / listing_score) * 100
    qualityRatio: { type: Number, default: null }, // deliveryScore / listingScore

    // Blockchain audit
    blockchainTxHash: { type: String, default: 'mock_pending' },
    dataHash: { type: String, default: null }, // SHA256 of image + score + timestamp

    // Who scanned
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIScan', aiScanSchema);
