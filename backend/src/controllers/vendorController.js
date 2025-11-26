const VendorProfile = require('../models/VendorProfile');
const User = require('../models/User');

// @desc    Create or update vendor profile
// @route   POST /api/vendors
// @access  Private (Vendor only)
const createUpdateProfile = async (req, res) => {
    const {
        businessName,
        city,
        category,
        description,
        priceRange,
        images,
        contactEmail,
        contactPhone,
        website,
    } = req.body;

    const profileFields = {
        user: req.user._id,
        businessName,
        city,
        category,
        description,
        priceRange,
        images,
        contactEmail,
        contactPhone,
        website,
    };

    try {
        let profile = await VendorProfile.findOne({ user: req.user._id });

        if (profile) {
            // Update
            profile = await VendorProfile.findOneAndUpdate(
                { user: req.user._id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new VendorProfile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get current vendor profile
// @route   GET /api/vendors/me
// @access  Private (Vendor only)
const getCurrentProfile = async (req, res) => {
    try {
        const profile = await VendorProfile.findOne({ user: req.user._id }).populate(
            'user',
            ['name', 'email']
        );

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all vendors with filters
// @route   GET /api/vendors
// @access  Public
const getVendors = async (req, res) => {
    const { city, category, priceRange, search } = req.query;
    let query = {};

    if (city) query.city = city;
    if (category) query.category = category;
    if (priceRange) query.priceRange = priceRange;
    if (search) {
        query.businessName = { $regex: search, $options: 'i' };
    }

    try {
        const profiles = await VendorProfile.find(query).populate('user', ['name', 'email']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get vendor by ID
// @route   GET /api/vendors/:id
// @access  Public
const getVendorById = async (req, res) => {
    try {
        const profile = await VendorProfile.findById(req.params.id).populate(
            'user',
            ['name', 'email']
        );

        if (!profile) return res.status(404).json({ msg: 'Vendor not found' });

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Vendor not found' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createUpdateProfile,
    getCurrentProfile,
    getVendors,
    getVendorById,
};
