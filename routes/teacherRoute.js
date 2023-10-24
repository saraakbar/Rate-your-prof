const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController'); 
const auth = require('../middleware/auth');

router.post('/teacher/add', teacherController.create);

router.get('/teacher_profiles',auth, teacherController.getTeachers);

module.exports = router;