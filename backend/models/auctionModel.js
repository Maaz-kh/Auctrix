const mongoose = require('mongoose');

// Auction Schema
const auctionSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    min_bid: { type: Number, required: true },
    total_bids: [
        {
            bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // To Track who placed the bid
            bid_amount: { type: Number, required: true }, // Amount of bid placed
        }
    ],
    final_bid: {
        bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Winner of the auction
        bid_amount: { type: Number, default: 0 } // Winning bid
    },
    location: { type: String, required: true },
    auction_status: { type: String, enum: ['Unactive', 'Expired', 'Completed', 'Active'], default: 'Active' },
    expire_at: { type: Date, required: true }, 
    posting_time: { type: Date, required: true },
}, { timestamps: true });

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
