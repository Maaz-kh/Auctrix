const mongoose = require('mongoose');

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    feedback_giver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedback_receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;