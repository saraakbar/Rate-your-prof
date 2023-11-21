const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const criteriaController = require('../controllers/criteriaController');

// Create a new criteria (Admin only)
router.post('/admin/criteria', auth, isAdmin, criteriaController.createCriteria);

// Get all criteria (Admin only)
router.get('/admin/criteria', auth, isAdmin, criteriaController.getCriteria);

// Get criteria for a specific department
router.get('/create_review/:teacherid', auth, criteriaController.getCriteriaByDepartment);

// Edit criteria details (Admin only)
router.put('/admin/criteria/:criteriaId', auth, isAdmin, criteriaController.editCriteria);

// Assign criteria to a department (Admin only)
router.post('/admin/criteria/assign/:department', auth, isAdmin, criteriaController.assignCriteria);

// Remove criteria from a department (Admin only)
router.delete('/admin/criteria/unassign/:department/:criteriaId', auth, isAdmin, criteriaController.unassignCriteria);

// Delete criteria (Admin only)
router.delete('/admin/criteria/:criteriaId', auth, isAdmin, criteriaController.deleteCriteria);

module.exports = router;
