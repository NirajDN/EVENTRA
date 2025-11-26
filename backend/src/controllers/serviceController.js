const Service = require('../models/Service');
const VendorProfile = require('../models/VendorProfile');

// @desc    Add a service
// @route   POST /api/services
// @access  Private (Vendor only)
const addService = async (req, res) => {
    const { name, description, price, category } = req.body;

    try {
        const vendor = await VendorProfile.findOne({ user: req.user._id });

        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor profile not found' });
        }

        const service = new Service({
            vendor: vendor._id,
            name,
            description,
            price,
            category,
        });

        await service.save();
        res.json(service);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get services by vendor ID
// @route   GET /api/services/:vendorId
// @access  Public
const getServices = async (req, res) => {
    try {
        const services = await Service.find({ vendor: req.params.vendorId });
        res.json(services);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Vendor only)
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        // Check if user owns the vendor profile that owns the service
        const vendor = await VendorProfile.findOne({ user: req.user._id });

        if (!vendor || service.vendor.toString() !== vendor._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await service.deleteOne();
        res.json({ msg: 'Service removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    addService,
    getServices,
    deleteService,
};
