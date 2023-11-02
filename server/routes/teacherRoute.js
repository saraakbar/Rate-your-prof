const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController'); 
const {auth} = require('../middleware/auth');

router.get('/search',auth, teacherController.searchTeachers);
router.get('/teacher/:ID',auth, teacherController.profile);

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - ID
 *         - faculty_type
 *         - department
 *         - position
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the teacher
 *         ID:
 *           type: string
 *           description: Teacher's identification (ID)
 *         faculty_type:
 *           type: string
 *           description: Type of faculty the teacher belongs to
 *         department:
 *           type: string
 *           description: Department where the teacher works
 *         position:
 *           type: string
 *           description: Position or title of the teacher
 *       example:
 *         name: Syed Sami Ul Ahbab
 *         ID: syeahbab
 *         faculty_type: Visiting Faculty
 *         department: Computer Science
 *         position: Visiting Faculty
 * /search:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     summary: Search for teachers
 *     description: Search for teachers based on various criteria.
 *     tags:
 *       - Teachers
 *     parameters:
 *       - name: facultyType
 *         in: query
 *         description: Faculty type filter.
 *         required: false
 *         type: string
 *       - name: department
 *         in: query
 *         description: Department filter.
 *         required: false
 *         type: string
 *       - name: facultyName
 *         in: query
 *         description: Faculty name filter.
 *         required: false
 *         type: string
 *       - name: alphabet
 *         in: query
 *         description: Alphabet filter.
 *         required: false
 *         type: string
 *       - name: page
 *         in: query
 *         description: Page number.
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: List of teachers and total count.
 *       404:
 *         description: No teachers found.
 *       500:
 *         description: Something went wrong.
 * /teacher/{ID}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     summary: Get teacher profile by ID
 *     description: Get the profile of a teacher by their ID, including their average rating and reviews.
 *     tags:
 *       - Teachers
 *     parameters:
 *       - name: ID
 *         in: path
 *         description: ID of the teacher to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 AverageRating:
 *                   type: number
 *                   description: The average rating of the teacher.
 *                 teacher:
 *                   type: object
 *                   properties:
 *                     position:
 *                       type: string
 *                       description: The teacher's position.
 *                     name:
 *                       type: string
 *                       description: The teacher's name.
 *                     department:
 *                       type: string
 *                       description: The teacher's department.
 *                     faculty_type:
 *                       type: string
 *                       description: The faculty type of the teacher.
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: The username of the user who submitted the review.
 *       404:
 *         description: Teacher not found.
 *       500:
 *         description: Server error.
 */

module.exports = router;