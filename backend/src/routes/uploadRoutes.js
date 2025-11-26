const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Return the Cloudinary URL
        res.json({ url: req.file.path });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ msg: 'Upload failed' });
    }
});

module.exports = router;
