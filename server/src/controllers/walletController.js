const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/config');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { verifyRazorpaySignature } = require('../services/escrowService');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────
// @desc    Get wallet data or create one if it doesn't exist
// ─────────────────────────────────────────────────────────
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user._id });
    }
    return sendSuccess(res, wallet, 'Wallet details fetched');
  } catch (error) {
    console.error('[getWallet]', error);
    return sendError(res, 'Failed to load wallet', 'WALLET_ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Link bank account to wallet (Simulated)
// ─────────────────────────────────────────────────────────
const linkBank = async (req, res) => {
  try {
    const { bankName, accountNumber, ifscCode, accountHolderName } = req.body;
    if (!accountNumber || !ifscCode) {
      return sendError(res, 'Account number and IFSC are required', 'MISSING_BANK_FIELDS', 400);
    }

    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user._id },
      {
        bankDetails: { bankName, accountNumber, ifscCode, accountHolderName, isLinked: true }
      },
      { new: true, upsert: true }
    );

    return sendSuccess(res, wallet, 'Bank account successfully linked to simulated wallet');
  } catch (error) {
    console.error('[linkBank]', error);
    return sendError(res, 'Failed to link bank', 'BANK_LINK_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Initialize adding funds via Razorpay
// ─────────────────────────────────────────────────────────
const initAddFunds = async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR
    if (!amount || amount <= 0) {
      return sendError(res, 'Valid amount is required', 'INVALID_AMOUNT', 400);
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `add_wallet_${req.user._id.toString().substr(-5)}`,
      notes: { userId: req.user._id.toString(), purpose: 'wallet_load' },
    });

    return sendSuccess(res, {
      razorpayOrderId: razorpayOrder.id,
      amount,
      amountInPaise: Math.round(amount * 100),
      key: RAZORPAY_KEY_ID,
    }, 'Razorpay session generated for loading funds');
  } catch (error) {
    console.error('[initAddFunds]', error);
    return sendError(res, 'Failed to create razorpay request', 'RAZORPAY_ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Verify Razorpay payment and update wallet (No Webhook logic)
// ─────────────────────────────────────────────────────────
const verifyAndLoadFunds = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, amount } = req.body;

    // 1. Signature verify
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, RAZORPAY_KEY_SECRET);
    if (!isValid) {
      return sendError(res, 'Tampering detected in transaction verification', 'INVALID_SIGNATURE', 400);
    }

    // 2. Update Wallet
    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { balance: Number(amount) } },
      { new: true, upsert: true }
    );

    // 3. Record transaction
    await Transaction.create({
      userId: req.user._id,
      walletId: wallet._id,
      type: 'credit',
      purpose: 'add_funds',
      amount: Number(amount),
      status: 'completed',
      referenceId: razorpayPaymentId,
      description: `Loaded funds using Razorpay (${razorpayOrderId})`,
    });

    return sendSuccess(res, wallet, `Successfully added ₹${amount} to your wallet`);
  } catch (error) {
    console.error('[verifyAndLoadFunds]', error);
    return sendError(res, 'Failed to complete transaction', 'TRANSACTION_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Withdraw from Wallet back to Bank (Simulated)
// ─────────────────────────────────────────────────────────
const withdrawToBank = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return sendError(res, 'Invalid amount', 'BAD_REQUEST', 400);

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet || wallet.balance < amount) {
      return sendError(res, 'Insufficient balance for withdrawal', 'INSUFFICIENT_FUNDS', 400);
    }

    if (!wallet.bankDetails?.isLinked) {
      return sendError(res, 'Please link a bank account before withdrawing', 'BANK_NOT_LINKED', 400);
    }

    // 1. Subtract from wallet balance
    wallet.balance -= amount;
    await wallet.save();

    // 2. Log simulated withdrawal
    await Transaction.create({
      userId: req.user._id,
      walletId: wallet._id,
      type: 'debit',
      purpose: 'withdrawal',
      amount: Number(amount),
      status: 'completed',
      description: `Withdrawn to ${wallet.bankDetails.bankName} (AC: ...${wallet.bankDetails.accountNumber.slice(-4)})`,
    });

    return sendSuccess(res, wallet, `Withdrawal of ₹${amount} has been initiated simulation successfully.`);
  } catch (error) {
    console.error('[withdrawToBank]', error);
    return sendError(res, 'Withdrawal processing failed', 'WITHDRAWAL_ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Direct Wallet-to-Wallet simulated transfer
// ─────────────────────────────────────────────────────────
const sendMoney = async (req, res) => {
  try {
    const { receiverPhone, amount } = req.body;
    if (!receiverPhone || !amount || amount <= 0) return sendError(res, 'Amount and receiver details missing', 'BAD_REQUEST', 400);

    // Locate receiver
    const receiver = await User.findOne({ phone: receiverPhone });
    if (!receiver) return sendError(res, 'Receiver not found on SmartKisan', 'USER_NOT_FOUND', 404);

    const senderWallet = await Wallet.findOne({ userId: req.user._id });
    if (!senderWallet || senderWallet.balance < amount) {
      return sendError(res, 'Insufficient balance to send', 'INSUFFICIENT_FUNDS', 400);
    }

    // Deduct sender
    senderWallet.balance -= Number(amount);
    await senderWallet.save();

    // Credit receiver
    let receiverWallet = await Wallet.findOneAndUpdate(
      { userId: receiver._id },
      { $inc: { balance: Number(amount) } },
      { new: true, upsert: true }
    );

    // Log for both
    await Transaction.create([
      {
        userId: req.user._id,
        walletId: senderWallet._id,
        type: 'debit',
        purpose: 'transfer',
        amount: Number(amount),
        status: 'completed',
        description: `Sent to ${receiver.name} (${receiverPhone})`
      },
      {
        userId: receiver._id,
        walletId: receiverWallet._id,
        type: 'credit',
        purpose: 'transfer',
        amount: Number(amount),
        status: 'completed',
        description: `Received from user ${req.user.name}`
      }
    ]);

    return sendSuccess(res, { newBalance: senderWallet.balance }, 'Simulated direct transfer success');
  } catch (error) {
    console.error('[sendMoney]', error);
    return sendError(res, 'Internal transaction simulation failed', 'SIMULATION_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get recent transactions for current user
// ─────────────────────────────────────────────────────────
const getTransactions = async (req, res) => {
  try {
    const logs = await Transaction.find({ userId: req.user._id }).sort('-createdAt').limit(20);
    return sendSuccess(res, logs, 'History fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch history', 'HISTORY_ERROR', 500);
  }
};

module.exports = {
  getWallet,
  linkBank,
  initAddFunds,
  verifyAndLoadFunds,
  withdrawToBank,
  sendMoney,
  getTransactions
};
