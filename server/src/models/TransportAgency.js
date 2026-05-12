const mongoose = require('mongoose');

const transportAgencySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    agencyName: { type: String, required: true, trim: true },
    vehicleCount: { type: Number, default: 1 },
    vehicleTypes: [{ type: String, enum: ['truck', 'mini-truck', 'tempo', 'pickup', 'refrigerated'] }],
    routes: [{ type: String }], // e.g. ['Pune-Mumbai', 'Nashik-Pune']
    // The specific scanner device ID assigned to this agency's delivery person
    assignedScannerId: { type: String, default: null },
    activeOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    completedOrders: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    currentLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      updatedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TransportAgency', transportAgencySchema);
