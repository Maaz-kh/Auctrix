const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    videos: [{ type: String }], // Array of video URLs
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;