const express = require('express');
const router = express.Router();
const {
    createReview,
    getVendorReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/:vendorId', getVendorReviews);

module.exports = router;
