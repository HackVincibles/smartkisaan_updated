const Order = require('../models/Order');
const AIScan = require('../models/AIScan');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const TransportAgency = require('../models/TransportAgency');

/**
 * T103 — Dispute Rules Engine
 */
const runRulesEngine = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  const [pickupScan, deliveryScan] = await Promise.all([
    AIScan.findOne({ orderId, scanType: 'PICKUP' }),
    AIScan.findOne({ orderId, scanType: 'DELIVERY' })
  ]);

  const pickupScore = pickupScan?.aiScore || 0;
  const deliveryScore = deliveryScan?.aiScore || 0;

  // T104 — Rule 1: delivery < 60 AND pickup > 80
  if (deliveryScore < 60 && pickupScore > 80) {
    return { verdict: 'FULL_REFUND', reason: 'Major quality loss in transit' };
  }

  // T105 — Rule 2: delivery 60-80 AND pickup > 80
  if (deliveryScore >= 60 && deliveryScore <= 80 && pickupScore > 80) {
    return { verdict: 'PARTIAL_REFUND', reason: 'Moderate quality loss in transit' };
  }

  // T106 — Rule 3: No pickup after 72h (Handled in edgeCases.js, but stub here)
  const hoursSincePayment = (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
  if (order.escrowState === 'PAID_ESCROW' && hoursSincePayment > 72) {
    await penalizeFarmer(order.farmerId);
    return { verdict: 'AUTO_REFUND', reason: 'No pickup within 72h' };
  }

  // T107 — Rule 4: Partial delivery
  if (order.deliveredQuantity && order.quantity && order.deliveredQuantity < order.quantity * 0.8) {
    await penalizeTransporter(order.agencyId);
    return { verdict: 'PROPORTIONAL_PAY', reason: 'Delivered quantity significantly below ordered quantity' };
  }

  // T108 — Rule 5: Fake dispute count
  const buyer = await User.findById(order.buyerId);
  if (buyer?.fakeDisputeCount > 3) {
    await User.findByIdAndUpdate(order.buyerId, { 
      isBanned: true, 
      banExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    });
    return { verdict: 'BAN_USER', reason: 'Excessive fake disputes' };
  }

  // T109 — Rule 6: Inconclusive
  return { verdict: 'ESCALATE_TO_ARBITRATOR', reason: 'AI results inconclusive or within margin' };
};

const penalizeFarmer = async (farmerId) => {
  await Farmer.findOneAndUpdate({ userId: farmerId }, { $inc: { trustScore: -10 } });
};

const penalizeTransporter = async (agencyId) => {
  await TransportAgency.findByIdAndUpdate(agencyId, { $inc: { reliabilityScore: -10 } });
};

module.exports = { runRulesEngine };
