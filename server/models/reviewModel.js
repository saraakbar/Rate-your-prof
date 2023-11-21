const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  course: { type: String, required: true },
  criteria: [{
    criterion: { type: mongoose.Schema.Types.ObjectId, ref: 'Criteria', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: null },
  }],
  date: { type: Date, default: Date.now },
  isGradReview: { type: Boolean, default: false, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  numOfLikes: { type: Number, default: 0 },
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  numOfDislikes: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Review', reviewSchema);
