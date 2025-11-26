const express = require('express');
const router = express.Router();
const {
    createUpdateProfile,
    getCurrentProfile,
    getVendors,
    getVendorById,
} = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createUpdateProfile);
router.get('/me', protect, getCurrentProfile);
router.get('/', getVendors);
router.get('/:id', getVendorById);

module.exports = router;
