const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
//const auth = require('../middleware/auth')


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1200s' })
}

const UserController = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, username, email, password, erp } = req.body;

            if (!(email && password && username && firstName && lastName && erp)) {
                return res.status(400).send("All input is required");
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).send("User already exists. Please login");
            }

            const usernameTaken = await User.findOne({ username });

            if (usernameTaken) {
                return res.status(409).send("Username taken.");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).send("Invalid email.");
            }

            if (erp.length != 5) {
                return res.status(400).send("Invalid ERP");
            }

            if (
                password.length < 8 ||              // Minimum length of 8 characters
                !/[a-z]/.test(password) ||         // At least one lowercase letter
                !/[A-Z]/.test(password) ||         // At least one uppercase letter
                !/[0-9]/.test(password)            // At least one number
            ) {
                return res.status(400).send("Password should be minimum 8 characters long and should include one lowercase letter, one uppercase letter, and at least one number");
            }

            const existingERP = await User.findOne({ erp });

            if (existingERP) {
                return res.status(409).send("ERP already exists. Please check again");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                erp: erp,
                email: email,
                password: hashedPassword
            });

            res.status(201).send("Registration Successful. Please login");

        } catch (error) {
            console.log(error);
            return res.status(500).send("Something went wrong");
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                return res.status(404).send("User not found");
            }

            if (await bcrypt.compare(password, existingUser.password)) {
                const token_user = { email: existingUser.email, id: existingUser._id, username: existingUser.username };
                const accessToken = generateAccessToken(token_user);
                const response = { message: "Login successful", accessToken: accessToken}
                res.status(201).send(response)
            } else {
                return res.status(400).send('Invalid credentials');
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send("Something went wrong");
        }
    },

    profile: async (req, res) => {
        try {

            const username = req.params.username;
            const currentUser = req.user.username;

            if (username == currentUser) {
                const userInfo = await User.findOne({username}).select('-password -__v -_id');

                const userId = req.user.id;
                const reviews = await Review.find({user: userId}).populate({path:'teacher', select:'name -_id'}).select('-_id -__v -user')

                const userProfile = {
                    userInfo,
                    reviews,
                };

                return res.json(userProfile);
            }
            
            /* Added functionality for looking at other people's profiles
            else if (username != currentUser) {
                const userId = await User.findOne({username}).select('username _id');
                const reviews = await Review.find({user: userId}).populate({path:'teacher', select:'name -_id'}).select('-_id -__v -user')

                const userProfile = {
                    reviews,
                };

                return res.json(userProfile);
            } */
        
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      },
};


module.exports = UserController;