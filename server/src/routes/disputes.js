const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  raiseDispute,
  getDisputeList,
  getDisputeStatus,
  getResolutionRules,
  acceptResolution,
  getAllDisputesAdmin,
  resolveDisputeAdmin
} = require('../controllers/disputeController');

// Public user access (Farmers and Buyers)
router.use(protect);

router.get('/my', getDisputeList);
router.get('/resolution-rules', getResolutionRules);
router.get('/:id/status', getDisputeStatus);
router.post('/raise', raiseDispute);
router.post('/accept-resolution', acceptResolution);

// Admin/Arbiter dashboard controls
router.get('/admin-all', requireRole('admin'), getAllDisputesAdmin);
router.patch('/admin-resolve/:id', requireRole('admin'), resolveDisputeAdmin);

module.exports = router;
