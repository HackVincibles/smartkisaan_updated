const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  getGlobalStats,
  getAuditTrails,
  toggleUserSuspension,
  getUsers,
  getPendingListings,
  approveListing,
  broadcastNotification
} = require('../controllers/adminController');

// FORCE GLOBAL ADMIN WRAPPER:
// No individual without the role badge may enter this router.
router.use(protect);
router.use(requireRole('admin'));

router.get('/stats', getGlobalStats);
router.get('/dashboard/stats', getGlobalStats);   // alias for frontend adminService
router.get('/audit-logs', getAuditTrails);
router.get('/users', getUsers);
router.get('/listings/review', getPendingListings);
router.get('/listings/pending', getPendingListings); // alias for frontend
router.post('/listings/:id/approve', approveListing);
router.post('/suspend-user', toggleUserSuspension);
router.post('/broadcast', broadcastNotification);

module.exports = router;
