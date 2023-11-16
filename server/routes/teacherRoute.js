const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController'); 
const {auth} = require('../middleware/auth');

router.get('/teachers',auth, teacherController.searchTeachers);
router.get('/teacher/:ID',auth, teacherController.profile);

module.exports = router;