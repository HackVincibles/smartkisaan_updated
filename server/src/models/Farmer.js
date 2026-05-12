const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    farmLocation: {
      address: { type: String, default: null },
      village: { type: String, default: null },
      district: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    farmSize: {
      value: { type: Number, default: null },
      unit: { type: String, enum: ['acres', 'hectares', 'bigha'], default: 'acres' },
    },
    crops: [{ type: String, trim: true }],
    totalListings: { type: Number, default: 0 },
    totalOrdersCompleted: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', farmerSchema);
