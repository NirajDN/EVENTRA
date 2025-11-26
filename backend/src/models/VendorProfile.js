const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true, // e.g., Photographer, Venue, Makeup Artist
    },
    description: {
        type: String,
    },
    priceRange: {
        type: String, // e.g., "$", "$$", "$$$" or "1000-5000"
    },
    images: [{
        type: String, // URLs
    }],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    contactEmail: String,
    contactPhone: String,
    website: String,
}, { timestamps: true });

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);
