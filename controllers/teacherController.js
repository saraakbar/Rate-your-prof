const Teacher = require('../models/teacherModel')
const Review = require('../models/reviewModel')

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

const teacherController = {
    /*create: async (req, res) => {
      try {
        const { name, faculty_type, position, department, photo } = req.body;
  
        const result = await Teacher.create({
          name: name,
          faculty_type: faculty_type,
          department: department,
          position: position,
          photo: photo
        });
  
        res.status(200).json({ message: 'Teacher added successfully' });
  
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
      }
    }, */
  
    searchTeachers: async (req, res) => {
      const { query, facultyType, department, facultyName, alphabet, page } = req.query;
      const perPage = 10; // Number of teachers per page
      const skip = (page - 1) * perPage; // Calculate the number of documents to skip
  
      try {
        const keywords = query ? query.toLowerCase().split(' ') : [];
  
        // Define the filter criteria based on selected filters
        const filterCriteria = {};
        if (facultyType) {
          filterCriteria.faculty_type = facultyType;
        }
        if (department) {
          filterCriteria.department = department;
        }
        if (facultyName){
            filterCriteria.name = {$regex: facultyName, $options: 'i' };
        }
  
        const queryConditions = [
          filterCriteria
        ];
  
        if (keywords.length > 0) {
          queryConditions.push({ name: { $all: keywords.map(keyword => new RegExp(keyword, 'i')) }});
        }
  
        if (alphabet) {
          const firstLetter = alphabet.charAt(0).toLowerCase();
          queryConditions.push({ name: { $regex: `^${firstLetter}`, $options: 'i' }});
        }
  
        // Construct the query
        const teachersCount = await Teacher.countDocuments({ $and: queryConditions });
        const teachers = await Teacher.find({ $and: queryConditions })
          .skip(skip)
          .limit(perPage);

        if (teachersCount == 0){
            return res.status(404).send("No teachers found");
        }

        res.status(200).json({ teachers, total: teachersCount });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
      }
    },

    profile: async (req, res) => {
        try {
            const averageRatings = [];
            const teacherID = req.params.ID;
            const teacher = await Teacher.findOne({ID: teacherID}).select('-__v -ID');
            if (!teacher) {
              return res.status(404).json({ message: 'Teacher not found' });
            }
            const teacherId = teacher._id;
            const reviews = await Review.find({teacher: teacherId}).populate({path:'user', select:'username -_id'}).select('-_id -__v -teacher')
            
            for (const review of reviews) {
              const criteria = review.criteria;
              const averageRating = avg_calculation(criteria);
              averageRatings.push(averageRating);
            }

            const totalAverageRating = averageRatings.reduce((acc, rating) => acc + rating, 0);
            const overallAverageRating = totalAverageRating / averageRatings.length;
            const AverageRating = overallAverageRating.toFixed(1);

            const teacherProfile = {
              AverageRating,
              teacher,
              reviews: reviews.map((review) => {
                  // Calculate like and dislike counts for each review
                  const likeCount = review.likes.length;
                  const dislikeCount = review.dislikes.length;

                  const modifiedReview = {
                    username: review.username,
                    course: review.course,
                    criteria: review.criteria,
                    comment: review.comment,
                    date: review.date,
                    isGradReview: review.isGradReview,
                    likeCount,
                    dislikeCount,
                    avg: avg_calculation(review.criteria).toFixed(1)
                };
          
                  return {
                      modifiedReview
                  };
              }),
          };
          
            return res.json(teacherProfile);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
    }
  };
  
module.exports = teacherController;