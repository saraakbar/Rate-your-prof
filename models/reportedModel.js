const mongoose = require('mongoose');

const reportedReviewSchema = new mongoose.Schema({
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isResolved: { type: Boolean, default: false, required: true },
    isDeleted: { type: Boolean, default: false, required: true }
})

const Report = mongoose.model('reportedReview', reportedReviewSchema)
module.exports = Report