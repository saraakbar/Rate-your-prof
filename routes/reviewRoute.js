const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController'); 
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - user
 *         - teacher
 *         - course
 *         - criteria
 *         - isGradReview
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user who created the review.
 *         teacher:
 *           type: string
 *           description: The ID of the teacher being reviewed.
 *         course:
 *           type: string
 *           description: The name of the course being reviewed.
 *         criteria:
 *           type: object
 *           properties:
 *             assessment_and_Feedback:
 *               type: number
 *               description: Rating for assessment and feedback (1-5).
 *             content_Knowledge:
 *               type: number
 *               description: Rating for content knowledge (1-5).
 *             instructional_Delivery:
 *               type: number
 *               description: Rating for instructional delivery (1-5).
 *             fair_Grading:
 *               type: number
 *               description: Rating for fair grading (1-5).
 *             exam_difficulty:
 *               type: number
 *               description: Rating for exam difficulty (1-5).
 *             course_Difficulty:
 *               type: number
 *               description: Rating for course difficulty (1-5).
 *             course_Workload:
 *               type: number
 *               description: Rating for course workload (1-5).
 *             course_Experience:
 *               type: number
 *               description: Rating for course experience (1-5).
 *             professionalism_and_Communication:
 *               type: number
 *               description: Rating for professionalism and communication (1-5).
 *           description: Review criteria ratings.
 *         comment:
 *           type: string
 *           description: Additional comments for the review.
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time when the review was created.
 *         isGradReview:
 *           type: boolean
 *           description: Indicates if the review is for a graduate course.
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of users who liked the review.
 *         numOfLikes:
 *           type: number
 *           description: The number of likes the review has received.
 *         dislikes:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of users who disliked the review.
 *         numOfDislikes:
 *           type: number
 *           description: The number of dislikes the review has received.
 *         avgRating:
 *           type: number
 *           description: The average rating for the review calculated based on criteria.
 *       example:
 *         user: "65371e8e440e850ad82e82f6"
 *         teacher: "65370292cace7d245b50daa4"
 *         course: "Introduction to Course"
 *         criteria:
 *           assessment_and_Feedback: 4
 *           content_Knowledge: 5
 *           instructional_Delivery: 4
 *           fair_Grading: 5
 *           exam_difficulty: 3
 *           course_Difficulty: 4
 *           course_Workload: 3
 *           course_Experience: 4
 *           professionalism_and_Communication: 5
 *         comment: "Great teacher! Very knowledgeable and helpful."
 *         date: "2023-10-26T14:30:00Z"
 *         isGradReview: false
 *         likes: ["6537085bf858fb1c5d6d81bd"]
 *         numOfLikes: 1
 *         dislikes: []
 *         numOfDislikes: 0
 *         avgRating: 4.2
 */

/**
 * @swagger
 * /create_review:
 *   post:
 *     summary: Create a review.
 *     description: Create a new review for a teacher's course.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course:
 *                 type: string
 *               criteria:
 *                 type: object
 *                 # Add schema for criteria properties here
 *               comment:
 *                 type: string
 *               isGrad:
 *                 type: boolean
 *             required:
 *               - course
 *               - criteria
 *               - isGrad
 *     responses:
 *       200:
 *         description: Review added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing fields.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 */


router.post('/create_review',auth, reviewController.create);

/**
 * @swagger
 * /like/{id}:
 *   patch:
 *     summary: Like a review.
 *     description: Like or undo like on a review.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to like.
 *     responses:
 *       200:
 *         description: Review liked or like removed.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 */

router.patch('/like/:id',auth, reviewController.like);

/**
 * @swagger
 * /dislike/{id}:
 *   patch:
 *     summary: Dislike a review.
 *     description: Dislike or undo dislike on a review.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to dislike.
 *     responses:
 *       200:
 *         description: Review disliked or dislike removed.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 */

router.patch('/dislike/:id',auth, reviewController.dislike);

module.exports = router;