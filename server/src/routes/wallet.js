const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWallet,
  linkBank,
  initAddFunds,
  verifyAndLoadFunds,
  withdrawToBank,
  sendMoney,
  getTransactions
} = require('../controllers/walletController');

// All endpoints require authentication
router.use(protect);

router.get('/', getWallet);
router.get('/history', getTransactions);
router.post('/link-bank', linkBank);

// Razorpay load flow without webhook
router.post('/add-funds/init', initAddFunds);
router.post('/add-funds/verify', verifyAndLoadFunds);

// Simulated Withdraw and Transfer
router.post('/withdraw', withdrawToBank);
router.post('/send', sendMoney);

module.exports = router;
