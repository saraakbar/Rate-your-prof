const Criteria = require('../models/criteriaModel');
const Department = require('../models/departmentModel');
const Teacher = require('../models/teacherModel');
const Review = require('../models/reviewModel');

const criteriaController = {
  createCriteria: async (req, res) => {
    try {
      const { name, description } = req.body;
      const criteria = await Criteria.create({ name, description });
      res.status(201).json(criteria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get all criteria
  getCriteria: async (req, res) => {
    try {
      const criteria = await Criteria.find();
      res.status(200).json(criteria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get criteria for a specific department
  getCriteriaByDepartment: async (req, res) => {
    const teach = req.params.teacherid;

    try {
      const teacherDetails = await Teacher.findOne({ ID: teach });

      if (!teacherDetails) {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      const departmentId = teacherDetails.department;
      const departmentDetails = await Department.findOne({ _id: departmentId })
        .populate({
          path: 'criteria',
        });

      const criteria = departmentDetails ? departmentDetails.criteria : [];
      res.status(200).json(criteria);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
},
  

  // Edit criteria details
  editCriteria: async (req, res) => {
    const { criteriaId } = req.params;
    const { name, description } = req.body;
    try {
      const criteria = await Criteria.findByIdAndUpdate(
        criteriaId,
        { name, description },
        { new: true }
      );
      res.status(200).json(criteria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Assign criteria to a department
  assignCriteria: async (req, res) => {
    const { department } = req.params;
    const { criteriaIds } = req.body;
    try {
      const departmentDetails = await Department.findOneAndUpdate(
        { _id: department },
        { $addToSet: { criteria: { $each: criteriaIds } } },
        { new: true }
      );
      res.status(200).json(departmentDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  

  // Remove criteria from a department
  unassignCriteria: async (req, res) => {
    const { department } = req.params;
    const { criteriaId } = req.body;
    try {
      const departmentDetails = await Department.findOneAndUpdate(
        { _id: department },
        { $pull: { criteria: criteriaId } },
        { new: true }
      );
      res.status(200).json(departmentDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  

  // Delete criteria
  deleteCriteria: async (req, res) => {
    const { criteriaId } = req.params;
    try {
      // Delete criteria itself
      await Criteria.findByIdAndDelete(criteriaId);

      // Update reviews to remove the deleted criteria
      await Review.updateMany({}, { $pull: { criteria: { criterion: criteriaId } } });

      res.status(200).json({ message: 'Criteria deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = criteriaController;
