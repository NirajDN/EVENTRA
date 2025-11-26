const express = require('express');
const router = express.Router();
const {
    addService,
    getServices,
    deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addService);
router.get('/:vendorId', getServices);
router.delete('/:id', protect, deleteService);

module.exports = router;
