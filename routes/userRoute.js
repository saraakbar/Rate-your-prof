const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const auth = require('../middleware/auth');

// Route for user registration
router.post('/register', UserController.register);

// Route for user login
router.post('/login', UserController.login);

// Route for user profile
router.get('/user/:username/profile',auth, UserController.profile);

//Route for delete profile
//router.delete('user/:username/delete',auth, UserController.delete);

//Route for update profile
//router.patch('user/:username/update',auth, UserController.update);

module.exports = router;