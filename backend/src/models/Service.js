const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VendorProfile',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
