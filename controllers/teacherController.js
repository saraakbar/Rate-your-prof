const Teacher = require('../models/teacherModel')
const Review = require('../models/reviewModel')

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

          const filter = { teacher: teacherId };
          if (req.query.isGradReview) {
            // If isGradReview is specified in the query, filter by its value
            filter.isGradReview = (req.query.isGradReview === 'true');
          }
          
          const reviews = await Review.find(filter)
            .populate({ path: 'user', select: 'username -_id' })
            .select('-_id -__v -teacher -likes -dislikes')
            .sort({ likes: -1 });
                    
          for (const review of reviews) {
            averageRatings.push(review.avgRating);
          }

          const totalAverageRating = averageRatings.reduce((acc, rating) => acc + rating, 0);
          const overallAverageRating = totalAverageRating / averageRatings.length;            
          const AverageRating = overallAverageRating.toFixed(1);

          const teacherProfile = {
            AverageRating,
            teacher:{
              position: teacher.position,
              name: teacher.name,
              department: teacher.department,                
              faculty_type: teacher.faculty_type,
             },
            reviews
          };
          
           return res.json(teacherProfile);
       } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }    
    }
  };
  
module.exports = teacherController;