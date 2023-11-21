const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController'); 
const {auth} = require('../middleware/auth');

router.get('/teachers',auth, teacherController.searchTeachers);
router.get('/teacher/:ID',auth, teacherController.profile);
router.get('/departments',auth, teacherController.getDepartments);
router.get('/universities',auth, teacherController.getUniversities);
router.get('/name/:ID',auth, teacherController.getName);

module.exports = router;