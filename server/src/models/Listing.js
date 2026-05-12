const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    productName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'dozen', 'litre', 'piece'],
      required: true,
    },
    expectedPrice: { type: Number, required: true }, // per unit in INR
    images: [{ type: String }], // Cloudinary URLs
    videos: [{ type: String }], // Cloudinary URLs
    harvestDate: { type: Date, default: null },
    isOrganic: { type: Boolean, default: false },
    description: { type: String, trim: true, default: null },
    storageCondition: {
      type: String,
      enum: ['room-temp', 'refrigerated', 'frozen', 'dry'],
      default: 'room-temp',
    },

    // AI-generated fields (filled after first scan)
    aiGrade: { type: String, enum: ['A', 'B', 'C', null], default: null },
    aiScore: { type: Number, min: 0, max: 100, default: null }, // 0–100
    suggestedPrice: { type: Number, default: null }, // AI suggested price
    shelfLifeDays: { type: Number, default: null }, // AI predicted shelf life

    // Listing status
    status: {
      type: String,
      enum: ['active', 'bid_received', 'sold', 'expired', 'deleted'],
      default: 'active',
    },

    // Farm location (copied from farmer for search)
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      district: { type: String, default: null },
      state: { type: String, default: null },
    },

    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for full-text search in marketplace
listingSchema.index({ productName: 'text', description: 'text', category: 'text' });
listingSchema.index({ status: 1, aiGrade: 1, expectedPrice: 1 });

module.exports = mongoose.model('Listing', listingSchema);
