const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.put('/:id', protect, updateBookingStatus);

module.exports = router;
