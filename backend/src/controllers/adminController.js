const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
    console.log('Admin getUsers request');
    try {
        const users = await User.find({}).select('-password');
        console.log(`Found ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private (Admin only)
const getVendors = async (req, res) => {
    console.log('Admin getVendors request');
    try {
        const vendors = await VendorProfile.find({}).populate('user', ['name', 'email']);
        console.log(`Found ${vendors.length} vendors`);
        res.json(vendors);
    } catch (error) {
        console.error('Error in getVendors:', error);
        res.status(500).send('Server Error');
    }
};

// @desc    Verify vendor
// @route   PUT /api/admin/vendors/:id/verify
// @access  Private (Admin only)
const verifyVendor = async (req, res) => {
    try {
        const vendor = await VendorProfile.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
        }

        vendor.isVerified = !vendor.isVerified;
        await vendor.save();

        res.json(vendor);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getBookings = async (req, res) => {
    console.log('Admin getBookings request received');
    try {
        const bookings = await Booking.find({})
            .populate('customer', 'name email')
            .populate('vendor', 'businessName city category')
            .sort({ createdAt: -1 });

        console.log(`Found ${bookings.length} bookings`);
        res.json(bookings);
    } catch (error) {
        console.error('Error in getBookings:', error);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private (Admin only)
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Booking removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getUsers,
    getVendors,
    verifyVendor,
    getBookings,
    deleteBooking
};
