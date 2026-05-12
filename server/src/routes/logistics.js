const express = require('express');
const router = express.Router();

const {
  getDashboard,
  getAssignedOrders,
  getAvailableLoads,
  acceptOrder,
  confirmPickup,
  confirmDelivery,
  updateLocation,
  getLocation,
  generateOrderQRs,
} = require('../controllers/logisticsController');

const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// ── Transport-only routes ─────────────────────────────────
router.get('/dashboard',                  protect, requireRole('transport'),             getDashboard);
router.get('/assigned-orders',            protect, requireRole('transport'),             getAssignedOrders);
router.get('/available-loads',           protect, requireRole('transport'),             getAvailableLoads);
router.post('/orders/:id/accept',         protect, requireRole('transport'),             acceptOrder);
router.post('/orders/:id/pickup',         protect, requireRole('transport'),             confirmPickup);
router.post('/orders/:id/delivery',       protect, requireRole('transport'),             confirmDelivery);
router.post('/location',                  protect, requireRole('transport'),             updateLocation);

// ── Any authenticated user can get order location ─────────
router.get('/orders/:id/location',        protect,                                       getLocation);

// ── QR generation (called after payment) ─────────────────
router.post('/orders/:id/generate-qr',   protect, requireRole('admin', 'transport'),    generateOrderQRs);

module.exports = router;
