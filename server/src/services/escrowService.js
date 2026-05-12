const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Farmer = require('../models/Farmer');
const TransportAgency = require('../models/TransportAgency');

/**
 * T81 — EscrowStateMachine Class
 * Handles state transitions and the settlement engine (Tasks 81-87)
 */
class EscrowStateMachine {
  constructor() {
    this.VALID_TRANSITIONS = {
      BID_PLACED:       ['PENDING_PAYMENT'],
      PENDING_PAYMENT:  ['PAID_ESCROW'],
      PAID_ESCROW:      ['PICKUP_ASSIGNED'],
      PICKUP_ASSIGNED:  ['PICKED_UP'],
      PICKED_UP:        ['IN_TRANSIT'],
      IN_TRANSIT:       ['DELIVERED'],
      DELIVERED:        ['COMPLETED', 'DISPUTED'],
      DISPUTED:         ['REFUNDED', 'COMPLETED'],
      COMPLETED:        [],
      REFUNDED:         [],
    };
  }

  // T82 — Validate Transitions
  validateTransition(currentState, nextState) {
    const allowed = this.VALID_TRANSITIONS[currentState] || [];
    if (!allowed.includes(nextState)) {
      throw new Error(`Invalid state transition: ${currentState} → ${nextState}.`);
    }
  }

  // T83 — Core Settlement Engine
  async releaseEscrow(orderId, deliveryAiScore, listingAiScore) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const qualityRatio = listingAiScore > 0 ? deliveryAiScore / listingAiScore : 0.8;
    const { agreedPrice, platformFee, freightCharge } = order;

    let farmerAmount, buyerRefund, settlementBasis;

    // T84 — Full Release (>= 80%)
    if (qualityRatio >= 0.80) {
      farmerAmount = agreedPrice - platformFee;
      buyerRefund = 0;
      settlementBasis = 'FULL_RELEASE';
    } 
    // T85 — Partial Refund (60-79%)
    else if (qualityRatio >= 0.60) {
      const penaltyRatio = (0.80 - qualityRatio) / 0.20;
      buyerRefund = Math.round(agreedPrice * penaltyRatio * 0.15);
      farmerAmount = agreedPrice - buyerRefund - platformFee;
      settlementBasis = 'PARTIAL_REFUND';
    } 
    // T86 — Full Refund (< 60%)
    else {
      farmerAmount = 0;
      buyerRefund = agreedPrice;
      settlementBasis = 'FULL_REFUND';
    }

    // T87 — Fixed Transporter Freight
    const transporterAmount = freightCharge;
    const platformRevenue = platformFee;

    // Update Records
    await Payment.findOneAndUpdate(
      { orderId: order._id },
      { farmerAmount, transporterAmount, buyerRefund, platformRevenue, status: 'settled', settledAt: new Date() }
    );

    order.escrowState = 'COMPLETED';
    await order.save();

    // Payout Logic (Stats)
    await Farmer.findByIdAndUpdate(order.farmerId, { $inc: { totalOrdersCompleted: 1, totalRevenue: farmerAmount } });
    if (order.agencyId) {
      await TransportAgency.findByIdAndUpdate(order.agencyId, { $inc: { totalEarnings: transporterAmount, completedOrders: 1 } });
    }

    return { orderId, qualityRatio, settlementBasis, breakdown: { farmerAmount, transporterAmount, buyerRefund } };
  }

  static verifyRazorpaySignature(orderId, paymentId, signature, secret) {
    const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
    return expected === signature;
  }
}

module.exports = new EscrowStateMachine();
