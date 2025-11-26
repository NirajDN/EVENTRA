const express = require('express');
const router = express.Router();
const {
    getUsers,
    getVendors,
    verifyVendor,
    getBookings,
    deleteBooking
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/vendors', protect, admin, getVendors);
router.put('/vendors/:id/verify', protect, admin, verifyVendor);
router.get('/bookings', protect, admin, getBookings);
router.delete('/bookings/:id', protect, admin, deleteBooking);

module.exports = router;
