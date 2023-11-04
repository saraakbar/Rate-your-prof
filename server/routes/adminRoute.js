const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController'); 
const {auth,isAdmin} = require('../middleware/auth');

router.post('/admin/login',AdminController.login);
router.get('/admin/reports',auth,isAdmin, AdminController.reports);
//router.get('/admin/search',auth,isAdmin, AdminController.searchUsers);
//router.get('/admin/user/:username',auth,isAdmin, AdminController.getUser);
//router.get('/admin/review/:id',auth,isAdmin, AdminController.getReview);
//router.patch('/admin/report/:id',auth,isAdmin, AdminController.resolveReport);
//router.patch('/admin/user/:username',auth,isAdmin, AdminController.suspendUser);
//router.delete('/admin/review/:id',auth,isAdmin, AdminController.deleteReview);
//router.delete('/admin/cleanup',auth,isAdmin, AdminController.deleteReports);

module.exports = router;