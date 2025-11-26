const Booking = require('../models/Booking');
const VendorProfile = require('../models/VendorProfile');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (Customer only)
const createBooking = async (req, res) => {
    const { vendorId, date, notes } = req.body;

    try {
        const vendor = await VendorProfile.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
        }

        const booking = new Booking({
            customer: req.user._id,
            vendor: vendorId,
            date,
            notes,
        });

        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get bookings for current user
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'vendor') {
            const vendor = await VendorProfile.findOne({ user: req.user._id });
            if (!vendor) {
                return res.status(404).json({ msg: 'Vendor profile not found' });
            }
            bookings = await Booking.find({ vendor: vendor._id })
                .populate('customer', ['name', 'email'])
                .sort({ date: 1 });
        } else {
            bookings = await Booking.find({ customer: req.user._id })
                .populate('vendor')
                .populate({
                    path: 'vendor',
                    populate: { path: 'user', select: 'name email' }
                })
                .sort({ date: 1 });
        }
        res.json(bookings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Vendor only)
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        const vendor = await VendorProfile.findOne({ user: req.user._id });

        if (!vendor || booking.vendor.toString() !== vendor._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus,
};
