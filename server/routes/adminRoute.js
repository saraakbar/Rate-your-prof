const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController'); 
const {auth,isAdmin} = require('../middleware/auth');

router.post('/admin/login',AdminController.login);
router.get('/admin/reports',auth,isAdmin, AdminController.reports);
router.post('/admin/create_university',auth,isAdmin, AdminController.createUniversity);
router.post('/admin/create_department',auth,isAdmin, AdminController.createDepartment);
//router.post('admin/createModerator',auth,isAdmin, AdminController.createModerator);
//router.delete('/admin/user/:username',auth,isAdmin, AdminController.deleteUser);
//router.delete('/admin/review/:id',auth,isAdmin, AdminController.deleteReview);
//router.patch('/admin/user/:username',auth,isAdmin, AdminController.suspendUser);
//router.patch('/admin/report/:id',auth,isAdmin, AdminController.resolveReport);
//router.delete('/admin/cleanup',auth,isAdmin, AdminController.deleteReports);
//router.get('/admin/users',auth,isAdmin, AdminController.getUsers);
//router.get('/admin/reviews',auth,isAdmin, AdminController.getReviews);
//router.get('/admin/review/:id',auth,isAdmin, AdminController.getReview);
//router.get('/admin/user/:username',auth,isAdmin, AdminController.getUser);



module.exports = router;