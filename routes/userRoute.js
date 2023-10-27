const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - username
 *         - erp
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         erp:
 *           type: number
 *           description: ERP of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *       example:
 *         firstName: Sara
 *         lastName: Ebrahim
 *         username: srakebr
 *         erp: 22967
 *         email: saraebrahim666@gmail.com
 *         password: akbarS*ra7
 */

// Route for user registration
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user with the provided information.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               erp:
 *                 type: number
 *     responses:
 *       201:
 *         description: Registration Successful. Please login.
 *       400:
 *         description: Bad Request. Check the request body for missing or invalid fields.
 *       409:
 *         description: Conflict. User already exists with the provided email or username.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 */
router.post('/register', UserController.register);

// Route for user login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user.
 *     description: Authenticate a user using their email and password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Login successful. Returns an access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 accessToken:
 *                   type: string
 *                   description: An access token for authenticated requests.
 *       400:
 *         description: Bad Request. Invalid credentials or missing fields.
 *       404:
 *         description: Not Found. User not found.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 */
router.post('/login', UserController.login);

// Route for user profile
/**
 * @swagger
 * /user/{username}/profile:
 *   get:
 *     summary: Get current user's profile.
 *     description: Retrieve the profile information and reviews for a logged in user.
 *     tags:
 *       - User
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the current.
 *     responses:
 *       200:
 *         description: User profile information and reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userInfo:
 *                   type: object
 *                   description: User information excluding password.
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       teacher:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *       403:
 *         description: Forbidden. User can only access their own profile.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 */
router.get('/user/:username/profile',auth, UserController.profile);

/**
 * @swagger
 * /user/{username}/delete:
 *   delete:
 *     summary: Delete current user's profile.
 *     description: Delete the user profile associated with the provided username.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user profile to be deleted.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       403:
 *         description: Forbidden. You are not authorized to delete this profile.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 */
router.delete('user/:username/delete',auth, UserController.delete);

//Route for update profile
//router.patch('user/:username/update',auth, UserController.update);

module.exports = router;