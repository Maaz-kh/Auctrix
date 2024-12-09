const mongoose = require('mongoose');

// HelpDesk Schema
const helpDeskSchema = new mongoose.Schema({
    help_seeker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    details_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to detailed issue report
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const HelpDesk = mongoose.model('HelpDesk', helpDeskSchema);

module.exports = HelpDesk;