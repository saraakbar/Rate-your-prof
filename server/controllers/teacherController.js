const Teacher = require('../models/teacherModel')
const Review = require('../models/reviewModel')
const Department = require('../models/departmentModel')
const University = require('../models/universityModel')

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
      const { query, facultyType, department, facultyName, alphabet, page, university} = req.query;
      const perPage = 10; // Number of teachers per page
      const skip = (page - 1) * perPage; // Calculate the number of documents to skip
  
      try {
        const keywords = query ? query.toLowerCase().split(' ') : [];
  
        // Define the filter criteria based on selected filters
        const filterCriteria = {};
        if (facultyType) {
          filterCriteria.faculty_type = facultyType;
        }

        if (university) {
          filterCriteria.university = university;
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
        .populate({
          path: 'department',
          select: 'name', // Select only the name field from the department
        })
        .populate({
          path: 'university',
          select: 'name', // Select only the name field from the university
        })
        .select('-__v -_id')
        .skip(skip)
        .limit(perPage);

        if (teachersCount == 0){
            return res.status(404).json({message: "No teachers found"});
        }

        res.status(200).json({ teachers, total: teachersCount });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },

    profile: async (req, res) => {
      try {
        const averageRatings = [];
        const teacherID = req.params.ID;
        const teacher = await Teacher.findOne({ ID: teacherID }).select('-__v -ID').populate('department', 'name -_id').populate('university', 'name -_id');
        if (!teacher) {
          return res.status(404).json({ message: 'Teacher not found' });
        }
        const teacherId = teacher._id;
    
        const filter = { teacher: teacherId };
        if (req.query.isGradReview) {
          // If isGradReview is specified in the query, filter by its value
          filter.isGradReview = req.query.isGradReview === 'true';
        }
    
        const reviews = await Review.find(filter)
        .populate({
          path: 'teacher',
          select: 'name ID -_id',
        })
        .populate({
          path: 'criteria.criterion',
          model: 'Criteria',
          select: 'name description -_id',
        })
        .populate({
          path: 'user',
          select: 'username img -_id', // Populate with just the username of the user
        })
        .select('-__v -likes -dislikes')
        .sort({ likes: -1 });

        const criteriaAverages = {};

for (const review of reviews) {
  for (const criterionObj of review.criteria) {
    const { criterion, rating } = criterionObj;

    // Check if the criterion is already in the criteriaAverages object
    if (criteriaAverages.hasOwnProperty(criterion.name)) {
      criteriaAverages[criterion.name] += rating;
    } else {
      criteriaAverages[criterion.name] = rating;
    }
  }
} 

const totalReviews = reviews.length;

// Initialize an object to store the trimmed and averaged criteria
const trimmedCriteriaAverages = {};

for (const criterionName in criteriaAverages) {
  // Trim the criterion name and calculate the average rating
  const trimmedName = criterionName.trim();
  const averageRating = (criteriaAverages[criterionName] / totalReviews).toFixed(1);

  // Add the trimmed name and rating to the result object
  trimmedCriteriaAverages[trimmedName] = averageRating;
}


        for (const review of reviews) {
          averageRatings.push(review.avgRating);
        }    
        const totalAverageRating = averageRatings.reduce(
          (acc, rating) => acc + rating,
          0
        );
        const overallAverageRating =
          totalAverageRating / averageRatings.length;
        const AverageRating = overallAverageRating.toFixed(1);
    
        const teacherProfile = {
          criteriaAverages: trimmedCriteriaAverages,
          AverageRating,
          teacher: {
            position: teacher.position,
            name: teacher.name,
            uni: teacher.university,
            department: teacher.department,
            faculty_type: teacher.faculty_type,
          },
          reviews,
        };
        
        console.log(teacherProfile)
        return res.json(teacherProfile);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    },

    getDepartments: async (req, res) => {
      try {
        const departments = await Department.find({}, 'name _id');        
        res.status(200).json(departments);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    },

    getUniversities: async (req, res) => {
      try {
        const universities = await University.find({}, 'name _id');
        res.status(200).json(universities);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    },

    getName: async (req, res) => {
      try {
        const teacher = await Teacher.findOne({ ID: req.params.ID }).select('name -_id');
        if (!teacher) {
          return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json(teacher);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    }
    
  };
  
module.exports = teacherController;