const mongoose = require('mongoose');

// Demand Request = reverse auction — buyer posts what they want, farmers bid
const demandRequestSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    productName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other'],
      required: true,
    },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal', 'ton', 'dozen', 'litre', 'piece'], required: true },
    maxBudget: { type: Number, required: true }, // buyer's max price per unit
    requiredByDate: { type: Date, default: null },
    deliveryAddress: { type: String, required: true },
    isOrganic: { type: Boolean, default: false },
    notes: { type: String, default: null },
    status: {
      type: String,
      enum: ['open', 'fulfilled', 'expired', 'cancelled'],
      default: 'open',
    },
    responseCount: { type: Number, default: 0 }, // how many farmers responded
  },
  { timestamps: true }
);

demandRequestSchema.index({ status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('DemandRequest', demandRequestSchema);
