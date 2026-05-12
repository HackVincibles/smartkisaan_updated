const mongoose = require('mongoose');

// The 9 valid states for an order — transitions enforced by stateMachine.js
const ESCROW_STATES = [
  'BID_PLACED',        // Buyer placed bid, waiting for farmer to accept
  'PENDING_PAYMENT',   // Farmer accepted bid, waiting for buyer to pay
  'PAID_ESCROW',       // Buyer paid, money in escrow, QR codes generated
  'PICKUP_ASSIGNED',   // Admin assigned transporter
  'PICKED_UP',         // Transporter scanned farmer QR — pickup confirmed
  'IN_TRANSIT',        // Product on the way
  'DELIVERED',         // Transporter scanned buyer QR — delivery confirmed
  'COMPLETED',         // Escrow released, all payments settled
  'DISPUTED',          // Dispute raised by farmer or buyer
  'REFUNDED',          // Full/partial refund processed
];

const orderSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportAgency', default: null },

    // Financial details
    agreedPrice: { type: Number, required: true }, // total product price
    pricePerUnit: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    freightCharge: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }, // agreedPrice + freightCharge + platformFee

    // Escrow state
    escrowState: {
      type: String,
      enum: ESCROW_STATES,
      default: 'BID_PLACED',
    },

    // Razorpay
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },

    // QR codes (base64 or URL)
    farmerQR: { type: String, default: null }, // Farmer shows this to transporter at pickup
    buyerQR: { type: String, default: null },  // Buyer shows this to transporter at delivery

    // Delivery details
    pickupAddress: { type: String, default: null },
    deliveryAddress: { type: String, default: null },
    pickupLocation: { lat: Number, lng: Number },
    deliveryLocation: { lat: Number, lng: Number },
    expectedDeliveryDate: { type: Date, default: null },
    actualPickupTime: { type: Date, default: null },
    actualDeliveryTime: { type: Date, default: null },

    // Timestamps for SLA tracking
    bidAcceptedAt: { type: Date, default: null },
    paymentDoneAt: { type: Date, default: null },
    pickedUpAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
module.exports.ESCROW_STATES = ESCROW_STATES;
