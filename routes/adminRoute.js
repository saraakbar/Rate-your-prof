const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController'); 
const {auth,isAdmin} = require('../middleware/auth');

//router.get('/admin/reports',auth,isAdmin, AdminController.getReports);
//router.get('/admin/search',auth,isAdmin, AdminController.searchUsers);
//router.get('/admin/user/:username',auth,isAdmin, AdminController.getUser);
//router.get('/admin/review/:id',auth,isAdmin, AdminController.getReview);
//router.patch('/admin/report/:id',auth,isAdmin, AdminController.resolveReport);
//router.delete('/admin/user/:username',auth,isAdmin, AdminController.deleteUser);
//router.delete('/admin/review/:id',auth,isAdmin, AdminController.deleteReview);
//router.delete('/admin/cleanup',auth,isAdmin, AdminController.deleteReports);

module.exports = router;