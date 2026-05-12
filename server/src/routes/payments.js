const express = require('express');
const router = express.Router();

const {
  createRazorpayOrder,
  verifyPayment,
  triggerEscrowRelease,
  getEscrowBalance,
  getPaymentHistory,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// ── Payment initiation (buyer) ────────────────────────────
router.post('/create-order',      protect, requireRole('buyer'),          createRazorpayOrder);

// ── Razorpay webhook / frontend callback (public) ─────────
// Must be public — Razorpay calls this directly
router.post('/verify',                                                     verifyPayment);
router.post('/capture',                                                    verifyPayment); // Manual fallback (T65)

// ── Escrow management ─────────────────────────────────────
router.post('/release-escrow',    protect, requireRole('admin'),           triggerEscrowRelease);
router.get('/balance/:orderId',   protect,                                 getEscrowBalance);
router.get('/history/:orderId',   protect,                                 getPaymentHistory);

module.exports = router;
