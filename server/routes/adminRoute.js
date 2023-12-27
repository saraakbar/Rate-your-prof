const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController'); 
const {auth,isAdmin} = require('../middleware/auth');

router.post('/admin/login',AdminController.login);
router.get('/admin/reports',auth,isAdmin, AdminController.reports);
router.post('/admin/create_university',auth,isAdmin, AdminController.createUniversity);
router.post('/admin/create_department',auth,isAdmin, AdminController.createDepartment);
router.delete('/admin/user/:user_id',auth,isAdmin, AdminController.deleteUser);
router.patch('/admin/user/:userId',auth,isAdmin, AdminController.suspendUser);
router.patch('/admin/report/:id/suspendUser',auth,isAdmin, AdminController.suspendUserbyReport);
router.delete('/admin/report/:id/review',auth,isAdmin, AdminController.deleteReviewByReport);
router.delete('/admin/report/:id/user',auth,isAdmin, AdminController.deleteUserByReport);
router.get('/admin/users',auth,isAdmin, AdminController.getUsers);
router.get('/admin/review/:id',auth,isAdmin, AdminController.getReview);
router.get('/admin/universities',auth,isAdmin, AdminController.getUniversities);
router.get('/admin/university/:uni_id',auth,isAdmin, AdminController.getUniversity);
router.get('/admin/departments/:uni_id',auth,isAdmin, AdminController.getDepts);
router.put('/admin/edit-university/:uni_id',auth,isAdmin, AdminController.editUniversity);
router.get('/admin/dashboard',auth,isAdmin, AdminController.getCount);
router.patch('/admin/report/:id',auth,isAdmin, AdminController.resolveReport);
router.delete('/admin/cleanup',auth,isAdmin, AdminController.deleteReports);

//router.post('admin/createModerator',auth,isAdmin, AdminController.createModerator);
//router.get('/admin/reviews',auth,isAdmin, AdminController.getReviews);
//router.delete('/admin/review/:id',auth,isAdmin, AdminController.deleteReview);



module.exports = router;