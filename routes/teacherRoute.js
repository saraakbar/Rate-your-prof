const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController'); 

router.post('/teacher/add', teacherController.create);

router.get('/teacher_profiles',teacherController.getTeachers);

module.exports = router;