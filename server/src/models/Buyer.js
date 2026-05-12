const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessType: {
      type: String,
      enum: ['wholesaler', 'retailer', 'hotel', 'restaurant', 'factory', 'exporter', 'individual'],
      default: 'individual',
    },
    businessName: { type: String, default: null },
    gstNumber: { type: String, default: null },
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    totalOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Buyer', buyerSchema);
