const Listing = require('../models/Listing');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Order = require('../models/Order');
const AIScan = require('../models/AIScan');

const { sendSuccess, sendError } = require('../utils/responseHelper');
const { gradeQuality, predictShelfLife, suggestPrice, detectCrop } = require('../services/aiService');
const notify = require('../services/notificationService');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────
// @desc    Get farmer dashboard stats
// @route   GET /api/v1/farmer/dashboard
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) return sendError(res, 'Farmer profile not found', 'FARMER_NOT_FOUND', 404);

    const farmerId = farmer._id;

    const [listingStats, orderStats, revenueResult] = await Promise.all([
      Listing.aggregate([
        { $match: { farmerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { farmerId } },
        { $group: { _id: '$escrowState', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { farmerId, escrowState: 'COMPLETED' } },
        { $group: { _id: null, totalRevenue: { $sum: '$agreedPrice' } } },
      ]),
    ]);

    const listingCounts = { active: 0, bid_received: 0, sold: 0, expired: 0, total: 0 };
    listingStats.forEach(({ _id, count }) => {
      if (_id in listingCounts) listingCounts[_id] = count;
      listingCounts.total += count;
    });

    const orderCounts = {};
    orderStats.forEach(({ _id, count }) => { orderCounts[_id] = count; });

    return sendSuccess(res, {
      farmer,
      listings: listingCounts,
      orders: {
        activeBids: orderCounts['BID_PLACED'] || 0,
        pendingPayments: orderCounts['PENDING_PAYMENT'] || 0,
        inTransit: (orderCounts['PICKED_UP'] || 0) + (orderCounts['IN_TRANSIT'] || 0),
        completed: orderCounts['COMPLETED'] || 0,
        disputed: orderCounts['DISPUTED'] || 0,
      },
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      trustScore: req.user.trustScore,
    }, 'Dashboard loaded');
  } catch (error) {
    console.error('[getDashboard]', error);
    return sendError(res, 'Failed to load dashboard', 'DASHBOARD_ERROR', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Create a new listing with AI grading
// @route   POST /api/v1/farmer/listings
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const createListing = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) return sendError(res, 'Farmer profile not found', 'FARMER_NOT_FOUND', 404);

    const imageUrls = req.files ? req.files.map((f) => f.path) : [];
    const firstImage = imageUrls[0] || null;

    const [cropDetected, qualityResult] = await Promise.all([
      detectCrop(firstImage),
      gradeQuality(firstImage),
    ]);

    const shelfLifeDays = await predictShelfLife(
      cropDetected || req.body.productName,
      qualityResult.grade
    );
    const priceRange = await suggestPrice(cropDetected || req.body.productName, qualityResult.grade);

    const location = req.body.location || {
      lat: farmer.farmLocation?.lat,
      lng: farmer.farmLocation?.lng,
      district: farmer.farmLocation?.district,
      state: farmer.farmLocation?.state,
    };

    const listing = await Listing.create({
      farmerId: farmer._id,
      ...req.body,
      images: imageUrls,
      location,
      aiGrade: qualityResult.grade,
      aiScore: qualityResult.score,
      shelfLifeDays,
      suggestedPrice: priceRange.suggested,
    });

    await Farmer.findByIdAndUpdate(farmer._id, { $inc: { totalListings: 1 } });

    const aiScan = await AIScan.create({
      orderId: null,
      listingId: listing._id,
      scanType: 'LISTING',
      imageUrl: firstImage,
      detectedCrop: cropDetected,
      aiGrade: qualityResult.grade,
      aiScore: qualityResult.score,
      shelfLifeDays,
      scannedBy: req.user._id,
      blockchainTxHash: `mock_listing_${listing._id}`,
    });

    return sendSuccess(
      res,
      {
        listing,
        aiScan,
        aiInsights: {
          grade: qualityResult.grade,
          score: qualityResult.score,
          details: qualityResult.details,
          shelfLifeDays,
          suggestedPrice: priceRange,
          detectedCrop: cropDetected,
        },
      },
      `Listing created! AI Grade: ${qualityResult.grade} (${qualityResult.score}/100)`,
      201
    );
  } catch (error) {
    console.error('[createListing]', error);
    return sendError(res, 'Failed to create listing', 'CREATE_LISTING_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all listings by this farmer (paginated)
// @route   GET /api/v1/farmer/listings
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const getMyListings = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) return sendError(res, 'Farmer profile not found', 'FARMER_NOT_FOUND', 404);

    const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = { farmerId: farmer._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Listing.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      listings,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    }, 'Listings fetched');
  } catch (error) {
    console.error('[getMyListings]', error);
    return sendError(res, 'Failed to fetch listings', 'FETCH_LISTINGS_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Update a listing (blocked if active bids exist)
// @route   PUT /api/v1/farmer/listings/:id
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const updateListing = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    const listing = await Listing.findOne({ _id: req.params.id, farmerId: farmer._id });

    if (!listing) return sendError(res, 'Listing not found', 'LISTING_NOT_FOUND', 404);
    if (listing.status === 'sold') return sendError(res, 'Cannot edit a sold listing', 'LISTING_SOLD', 400);

    const activeBidCount = await Order.countDocuments({
      listingId: listing._id,
      escrowState: { $in: ['BID_PLACED', 'PENDING_PAYMENT', 'PAID_ESCROW'] },
    });
    if (activeBidCount > 0) {
      return sendError(res, `Cannot edit listing with ${activeBidCount} active bid(s)`, 'LISTING_HAS_ACTIVE_BIDS', 400);
    }

    const updated = await Listing.findByIdAndUpdate(
      listing._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, updated, 'Listing updated successfully');
  } catch (error) {
    console.error('[updateListing]', error);
    return sendError(res, 'Failed to update listing', 'UPDATE_LISTING_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Soft delete a listing
// @route   DELETE /api/v1/farmer/listings/:id
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const deleteListing = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    const listing = await Listing.findOne({ _id: req.params.id, farmerId: farmer._id });

    if (!listing) return sendError(res, 'Listing not found', 'LISTING_NOT_FOUND', 404);
    if (listing.status === 'sold') return sendError(res, 'Cannot delete a sold listing', 'LISTING_SOLD', 400);

    const activeOrder = await Order.findOne({
      listingId: listing._id,
      escrowState: { $in: ['PAID_ESCROW', 'PICKUP_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] },
    });
    if (activeOrder) return sendError(res, 'Cannot delete listing with an active order', 'ACTIVE_ORDER_EXISTS', 400);

    await Listing.findByIdAndUpdate(listing._id, { status: 'expired' });
    return sendSuccess(res, null, 'Listing deleted successfully (marked as expired)');
  } catch (error) {
    console.error('[deleteListing]', error);
    return sendError(res, 'Failed to delete listing', 'DELETE_LISTING_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all bids placed on farmer's listings
// @route   GET /api/v1/farmer/bids
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const getBids = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) return sendError(res, 'Farmer profile not found', 'FARMER_NOT_FOUND', 404);

    const bids = await Order.find({ farmerId: farmer._id, escrowState: 'BID_PLACED' })
      .populate('listingId', 'productName quantity unit images aiGrade')
      .populate('buyerId', 'businessName businessType')
      .sort('-createdAt');

    return sendSuccess(res, bids, `${bids.length} active bid(s) found`);
  } catch (error) {
    console.error('[getBids]', error);
    return sendError(res, 'Failed to fetch bids', 'FETCH_BIDS_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Accept a bid → escrowState = PENDING_PAYMENT
// @route   POST /api/v1/farmer/bids/:bidId/accept
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const acceptBid = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    const order = await Order.findOne({
      _id: req.params.bidId,
      farmerId: farmer._id,
      escrowState: 'BID_PLACED',
    }).populate('listingId');

    if (!order) return sendError(res, 'Bid not found or already processed', 'BID_NOT_FOUND', 404);

    order.escrowState = 'PENDING_PAYMENT';
    order.bidAcceptedAt = new Date();
    await order.save();

    await Listing.findByIdAndUpdate(order.listingId._id, { status: 'bid_received' });

    // ── Notify Buyer ─────────────────────────────────────────
    try {
      const buyerProfile = await Buyer.findById(order.buyerId).populate('userId');
      const buyerUser = buyerProfile?.userId;
      
      if (buyerUser) {
        await notify.push(buyerUser._id, '✅ Bid Accepted!', `Farmer ${req.user.name} accepted your bid for ${order.listingId.productName}. Please complete payment to start the order.`);
        if (buyerUser.phone) {
          await notify.sms(buyerUser.phone, `SmartKisan: Your bid for ${order.listingId.productName} was accepted! Pay now to secure your stock.`);
        }
      }
    } catch (err) {
      console.warn('[Notification Error]', err.message);
    }

    return sendSuccess(res, { order }, 'Bid accepted! Buyer has been notified via SMS and Push.');
  } catch (error) {
    console.error('[acceptBid]', error);
    return sendError(res, 'Failed to accept bid', 'ACCEPT_BID_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get farmer's order history (paginated)
// @route   GET /api/v1/farmer/orders
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) return sendError(res, 'Farmer profile not found', 'FARMER_NOT_FOUND', 404);

    const { status, page = 1, limit = 10 } = req.query;
    const filter = { farmerId: farmer._id };
    if (status) filter.escrowState = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('listingId', 'productName images unit')
        .populate('buyerId', 'businessName businessType address')
        .populate('agencyId', 'agencyName')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    }, 'Orders fetched');
  } catch (error) {
    console.error('[getOrders - farmer]', error);
    return sendError(res, 'Failed to fetch orders', 'FETCH_ORDERS_FAILED', 500);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get mock mandi/e-NAM price data
// @route   GET /api/v1/farmer/mandi-rates
// @access  Private (farmer)
// ─────────────────────────────────────────────────────────
const getMandiRates = async (req, res) => {
  const { crop } = req.query;
  const today = new Date().toISOString().split('T')[0];

  const mockRates = {
    tomato:    { price: 22, unit: 'kg', market: 'Pune APMC', date: today, change: '+2.5%' },
    onion:     { price: 18, unit: 'kg', market: 'Lasalgaon APMC', date: today, change: '-1.2%' },
    potato:    { price: 15, unit: 'kg', market: 'Agra APMC', date: today, change: '+0.8%' },
    wheat:     { price: 22, unit: 'kg', market: 'Delhi Mandi', date: today, change: '+0.5%' },
    rice:      { price: 35, unit: 'kg', market: 'Chhattisgarh APMC', date: today, change: '+1.1%' },
    apple:     { price: 85, unit: 'kg', market: 'Shimla APMC', date: today, change: '-3.2%' },
    mango:     { price: 65, unit: 'kg', market: 'Ratnagiri APMC', date: today, change: '+5.0%' },
    cotton:    { price: 65, unit: 'kg', market: 'Akola APMC', date: today, change: '+1.3%' },
    soybean:   { price: 45, unit: 'kg', market: 'Indore APMC', date: today, change: '-0.5%' },
  };

  if (crop && typeof crop === 'string') {
    const rate = mockRates[crop.toLowerCase()];
    if (!rate) return sendError(res, `No mandi data for "${crop}"`, 'CROP_NOT_FOUND', 404);
    return sendSuccess(res, { crop, ...rate }, 'Mandi rate fetched');
  }

  return sendSuccess(res, { rates: mockRates, source: 'e-NAM (mock)', note: 'Real e-NAM API in Phase 8' }, 'All mandi rates');
};

const getClusters = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    const farmers = await Farmer.find({ _id: { $ne: farmer._id } });
    const { findClusters } = require('../services/groupBuying');
    const clusters = findClusters([...farmers, farmer]);
    return sendSuccess(res, clusters, 'Farmer clusters found for group selling');
  } catch (error) {
    return sendError(res, 'Failed to find clusters', 'CLUSTER_ERR', 500);
  }
};

const checkInsurance = async (req, res) => {
  try {
    const { checkPMFBYEligibility } = require('../services/insuranceService');
    const eligibility = await checkPMFBYEligibility(req.user._id);
    return sendSuccess(res, eligibility, 'Insurance eligibility status');
  } catch (error) {
    return sendError(res, 'Insurance check failed', 'INS_ERR', 500);
  }
};

module.exports = {
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
  checkInsurance
};
