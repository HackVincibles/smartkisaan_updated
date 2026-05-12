const express = require('express');
const router = express.Router();

const {
  getListings,
  placeBid,
  getDemands,
  createDemand,
  getOrders,
  initiatePayment,
  verifyDelivery,
} = require('../controllers/buyerController');

const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { validate, placeBidSchema, createDemandSchema } = require('../validators/listingValidator');

// All routes: Auth + Buyer role required
router.use(protect, requireRole('buyer'));

// ── Marketplace ───────────────────────────────────────────
router.get('/listings',                                               getListings);
router.post('/listings/:id/bid',     validate(placeBidSchema),        placeBid);

// ── Demand / Reverse Auction ──────────────────────────────
router.get('/demand',                                                 getDemands);
router.post('/demand',               validate(createDemandSchema),    createDemand);

// ── Orders ────────────────────────────────────────────────
router.get('/orders',                                                 getOrders);
router.post('/orders/:id/pay',                                        initiatePayment);

// ── Delivery Verification ─────────────────────────────────
router.post('/verify-delivery',                                       verifyDelivery);

module.exports = router;
