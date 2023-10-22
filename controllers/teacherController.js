const Teacher = require('../models/teacherModel')

const teacherController = {
    create: async (req, res) => {
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
    },
  
    getTeachers: async (req, res) => {
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
  
        // Define the query conditions for name and filters
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
        const sortCriteria = {}; // No sorting
        const teachersCount = await Teacher.countDocuments({ $and: queryConditions });
        const teachers = await Teacher.find({ $and: queryConditions })
          .sort(sortCriteria)
          .skip(skip)
          .limit(perPage);
  
        res.status(200).json({ teachers, total: teachersCount });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
      }
    }
  };
  
module.exports = teacherController;