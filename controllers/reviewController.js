const Review = require('../models/reviewModel')
const Teacher = require('../models/teacherModel')
const jwt = require('jsonwebtoken');

const reviewController = {
    create: async (req, res) => {
        try {
            const {course, criteria, comment, isGrad} = req.body
            const {teacher} = req.query
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedToken = jwt.decode(token, {
                complete: true
            });
            owner = decodedToken.payload.id
            const teach = await Teacher.findOne({ID:teacher})

            if (!teach) {
                return res.status(400).send("Teacher does not exist");
            }

            
            if (!(course && criteria && isGrad)) {
                return res.status(400).send("All input is required");
            }

            const result = await Review.create({
                user: owner,
                teacher: teach._id,
                course: course,
                criteria: criteria,
                comment: comment,
                isGradReview: isGrad,
                likes: [],
                dislikes: []
            })

            res.status(200).json({ message: 'Review added successfully' });
  
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

module.exports = reviewController;