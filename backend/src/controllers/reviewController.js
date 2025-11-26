const Review = require('../models/Review');
const VendorProfile = require('../models/VendorProfile');
const Booking = require('../models/Booking');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Customer only)
const createReview = async (req, res) => {
    const { vendorId, rating, comment } = req.body;

    try {
        const vendor = await VendorProfile.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
        }

        // Check if user has already reviewed this vendor
        const alreadyReviewed = await Review.findOne({
            customer: req.user._id,
            vendor: vendorId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ msg: 'You have already reviewed this vendor' });
        }

        // Optional: Check if user has a booking with this vendor
        // const hasBooking = await Booking.findOne({
        //   customer: req.user._id,
        //   vendor: vendorId,
        //   status: 'completed'
        // });
        // if (!hasBooking) {
        //   return res.status(400).json({ msg: 'You can only review vendors you have booked' });
        // }

        const review = new Review({
            customer: req.user._id,
            vendor: vendorId,
            rating,
            comment,
        });

        await review.save();

        // Update vendor rating
        const reviews = await Review.find({ vendor: vendorId });
        vendor.numReviews = reviews.length;
        vendor.rating =
            reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await vendor.save();

        res.status(201).json(review);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get reviews for a vendor
// @route   GET /api/reviews/:vendorId
// @access  Public
const getVendorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ vendor: req.params.vendorId })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createReview,
    getVendorReviews,
};
