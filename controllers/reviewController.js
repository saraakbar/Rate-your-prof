const Review = require('../models/reviewModel')
const Teacher = require('../models/teacherModel')

const reviewController = {
    create: async (req, res) => {
        try {
            const {course, criteria, comment, isGrad} = req.body
            const {teacher} = req.query
            owner = req.user.id
            const teach = await Teacher.findOne({ID:teacher}).select('_id')

            if (!(course && criteria && isGrad)) {
                return res.status(400).send("All input is required");
            }

            const result = await Review.create({
                user: owner,
                teacher: teach,
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
    },

    like: async (req, res) => {
        try{
            const id = req.params.id
            const userId = req.user.id
            likes = await Review.findOne({_id: id}).select(' dislikes likes -_id')
                if (likes.dislikes.includes(userId)) {
                    await Review.findOneAndUpdate({_id: id}, { $pull: { dislikes: userId } });
                    await Review.findOneAndUpdate({_id: id }, { $push: { likes: userId } });
                    res.status(200).json({message: 'dislike removed, review liked'})
                }
                else if (likes.likes.includes(userId)) {
                    await Review.findOneAndUpdate({_id: id}, { $pull: { likes: userId } });
                    res.status(200).json({message: 'Like removed'})
                }
                else{
                    await Review.findOneAndUpdate({_id: id }, { $push: { likes: userId } });
                    res.status(200).json({message: 'Review liked'})
                }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
      
    },

    dislike: async (req, res) => {
        try{
            const id = req.params.id
            const userId = req.user.id
            likes = await Review.findOne({_id: id}).select(' dislikes likes -_id')
            if (likes.likes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { likes: userId } });
                await Review.findOneAndUpdate({_id: id }, { $push: { dislikes: userId } });
                res.status(200).json({message: 'like removed, review disliked'})
            }
            else if (likes.dislikes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { dislikes: userId } });
                res.status(200).json({message: 'dislike removed'})
            }
            else{
                await Review.findOneAndUpdate({_id: id }, { $push: { dislikes: userId } });
                res.status(200).json({message: 'Review disliked'})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }  
    }
}

module.exports = reviewController;