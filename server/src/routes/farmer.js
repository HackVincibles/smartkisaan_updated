const express = require('express');
const router = express.Router();

const {
  getDashboard,
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
  getBids,
  acceptBid,
  getOrders,
  getMandiRates,
  getClusters,
  checkInsurance,
} = require('../controllers/farmerController');

const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { uploadImages } = require('../middleware/upload');
const { validate, createListingSchema, updateListingSchema } = require('../validators/listingValidator');

// All routes: Auth + Farmer role required
router.use(protect, requireRole('farmer'));

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard',                                              getDashboard);
router.get('/dashboard/stats',                                        getDashboard); // alias for frontend

// ── Listings ──────────────────────────────────────────────
router.post('/listings',   uploadImages, validate(createListingSchema), createListing);
router.get('/listings',                                               getMyListings);
router.get('/listings/:id',                                           getMyListings); // frontend calls this
router.put('/listings/:id',              validate(updateListingSchema), updateListing);
router.delete('/listings/:id',                                         deleteListing);

// ── Bids ──────────────────────────────────────────────────
router.get('/bids',                                                   getBids);
router.get('/listings/:listingId/bids',                              getBids); // alias for frontend
router.post('/bids/:bidId/accept',                                    acceptBid);

// ── Orders ────────────────────────────────────────────────
router.get('/orders',                                                 getOrders);

// ── Market Data ───────────────────────────────────────────
router.get('/mandi-rates',                                            getMandiRates);
router.get('/mandi-prices',                                           getMandiRates); // alias for frontend

// ── New Features ──────────────────────────────────────────
router.get('/clusters',                                               getClusters);
router.get('/insurance-check',                                        checkInsurance);

module.exports = router;
