const Review = require('../models/reviewModel')
const Teacher = require('../models/teacherModel')

function avg_calculation(criteria){
    const totalRating = criteria.assessment_and_Feedback +
                        criteria.content_Knowledge +
                        criteria.instructional_Delivery +
                        criteria.fair_Grading +
                        criteria.exam_difficulty +
                        criteria.course_Difficulty +
                        criteria.course_Workload +
                        criteria.course_Experience +
                        criteria.professionalism_and_Communication;
    
    // Calculate the average rating for assessment_and_Feedback
    const averageRating = totalRating / 9;
    return averageRating;
  }

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

            const average = avg_calculation(criteria).toFixed(1)

            const result = await Review.create({
                user: owner,
                teacher: teach,
                course: course,
                criteria: criteria,
                comment: comment,
                isGradReview: isGrad,
                likes: [],
                dislikes: [],
                avgRating: average
            })

            res.status(200).json({ message: 'Review added successfully' });
  
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    like: async (req, res) => {
        try{
            const id = req.params.id
            const userId = req.user.id
            likes = await Review.findOne({_id: id}).select(' dislikes likes -_id')
                if (likes.dislikes.includes(userId)) {
                    await Review.findOneAndUpdate({_id: id}, { $pull: { dislikes: userId } });
                    await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: -1 } });
                    await Review.findOneAndUpdate({_id: id }, { $push: { likes: userId } });
                    await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: 1 } });
                    res.status(200).json({message: 'dislike removed, review liked'})
                }
                else if (likes.likes.includes(userId)) {
                    await Review.findOneAndUpdate({_id: id}, { $pull: { likes: userId } });
                    await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: -1 } });
                    res.status(200).json({message: 'Like removed'})
                }
                else{
                    await Review.findOneAndUpdate({_id: id }, { $push: { likes: userId } });
                    await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: 1 } });
                    res.status(200).json({message: 'Review liked'})
                }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
      
    },

    dislike: async (req, res) => {
        try{
            const id = req.params.id
            const userId = req.user.id
            likes = await Review.findOne({_id: id}).select(' dislikes likes -_id')
            if (likes.likes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { likes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: -1 } });
                await Review.findOneAndUpdate({_id: id }, { $push: { dislikes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: 1 } });
                res.status(200).json({message: 'like removed, review disliked'})
            }
            else if (likes.dislikes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { dislikes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: -1 } });
                res.status(200).json({message: 'dislike removed'})
            }
            else{
                await Review.findOneAndUpdate({_id: id }, { $push: { dislikes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: 1 } });
                res.status(200).json({message: 'Review disliked'})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }  
    },

    delete: async (req, res) => {
        try{
            const id = req.params.id
            const userId = req.user.id

            const deletedReview = await Review.findOneAndDelete({ _id: id, user: userId });

            if (!deletedReview) {
                return res.status(404).json({ message: 'Review not found' });
              }

            res.status(200).json({ message: 'Review deleted successfully' });
            
        } catch (error){
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

}

module.exports = reviewController;