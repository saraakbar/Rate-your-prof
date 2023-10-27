const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    course: {type: String, required: true},
    criteria: {
        assessment_and_Feedback: { type: Number, min: 1, max: 5, required: true},
        content_Knowledge: { type: Number, min: 1, max: 5, required: true},
        instructional_Delivery: { type: Number, min: 1, max: 5 ,required: true},
        fair_Grading: { type: Number, min: 1, max: 5,required: true },
        exam_difficulty: { type: Number, min: 1, max: 5,required: true },
        course_Difficulty: { type: Number, min: 1, max: 5,required: true },
        course_Workload: { type: Number, min: 1, max: 5,required: true },
        course_Experience: { type: Number, min: 1, max: 5,required: true },
        professionalism_and_Communication: { type: Number, min: 1, max: 5,required: true },
      },
    comment: { type: String, default: null },
    date: { type: Date, default: Date.now },
    isGradReview: { type: Boolean, default: false, required: true},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    numOfLikes: { type: Number, default: 0 },
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    numOfDislikes: {type: Number, default: 0},
    avgRating: {type: Number, default: 0}
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review