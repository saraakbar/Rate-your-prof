const Review = require('../models/reviewModel')
const Teacher = require('../models/teacherModel')

const reviewController = {
    create: async (req, res) => {
        try {
          const { course, criteria, isGrad } = req.body;
          const teacherId = req.params.teacherid;
          const ownerId = req.user.id;
    
          const teacher = await Teacher.findOne({ ID: teacherId }).select('_id');
    
          if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
          }
    
          if (!(course && criteria && isGrad !== undefined && isGrad !== null)) {
            return res.status(400).send({message:'All input is required'});
          }
    
          const isCriteriaValid = criteria.every(
            (criterion) => criterion.rating >= 1 && criterion.rating <= 5
          );
    
          if (!isCriteriaValid) {
            return res.status(400).send({message:'Criteria ratings must be between 1 and 5'});
          }
    
          // Calculate the average rating for all criteria
          const totalRating = criteria.reduce((total, criterion) => total + Number(criterion.rating), 0);
          const average = (totalRating / criteria.length).toFixed(1);

          const result = await Review.create({
            user: ownerId,
            teacher: teacher,
            course: course,
            criteria: criteria,
            isGradReview: isGrad,
            likes: [],
            dislikes: [],
            avgRating: average,
          });
    
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
            if (!likes) {
                return res.status(404).json({ message: 'Review not found' });
            }
            if (likes.dislikes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { dislikes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: -1 } });
                await Review.findOneAndUpdate({_id: id }, { $push: { likes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: 1 } });
                const info = await Review.find({_id: id}).select('numOfLikes numOfDislikes -_id')
                const message = 'dislike removed, review liked'
                const response = {info,message}
                res.status(200).json(response)
                }
            else if (likes.likes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { likes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: -1 } });
                const info = await Review.find({_id: id}).select('numOfLikes numOfDislikes -_id')
                const message =  'Like removed'
                const response = {info,message}
                res.status(200).json(response)
            }
             else{
                await Review.findOneAndUpdate({_id: id }, { $push: { likes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: 1 } });
                const info = await Review.find({_id: id}).select('numOfLikes numOfDislikes -_id')
                const message = 'Review liked'
                const response = {info,message}
                res.status(200).json(response)
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
            if (!likes) {
                return res.status(404).json({ message: 'Review not found' });
            }
            if (likes.likes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { likes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfLikes: -1 } });
                await Review.findOneAndUpdate({_id: id }, { $push: { dislikes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: 1 } });
                const info = await Review.find({_id: id}).select('numOfLikes numOfDislikes -_id')
                const message = 'like removed, review disliked'
                const response = {info, message}
                res.status(200).json(response)
            }
            else if (likes.dislikes.includes(userId)) {
                await Review.findOneAndUpdate({_id: id}, { $pull: { dislikes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: -1 } });
                const info = await Review.find({_id: id}).select('numOfLikes numOfDislikes -_id')
                const message = 'dislike removed'
                const response = {info,message}
                res.status(200).json(response)
            }
            else{
                await Review.findOneAndUpdate({_id: id }, { $push: { dislikes: userId } });
                await Review.findOneAndUpdate({_id: id}, { $inc: { numOfDislikes: 1 } });
                const info = await Review.find({_id: id}).select('numOfLikes numOfDislikes -_id')
                const message = 'Review disliked'
                const response = {info,message}
                res.status(200).json(response)
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
                return res.status(404).json({ message: 'Review does not exist or you are not authorized to delete it' });
              }

            res.status(200).json({ message: 'Review deleted successfully' });
            
        } catch (error){
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

}

module.exports = reviewController;