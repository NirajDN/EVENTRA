const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VendorProfile',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'completed'],
        default: 'pending',
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
