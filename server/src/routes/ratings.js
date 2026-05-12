const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createRating, getTargetedReviews } = require('../controllers/ratingController');

// Read-only review feed is often public visibility in e-commerce
router.get('/user/:userId', getTargetedReviews);

// Post is private
router.post('/create', protect, createRating);

module.exports = router;
