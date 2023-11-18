const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const Report = require('../models/reportedModel')

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' })
}

const UserController = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, username, email, password, erp} = req.body;

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

            const role = 'user'

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                erp: erp,
                email: email,
                password: hashedPassword,
                role: role,
                suspended: "false"
            });

            res.status(201).send("Registration Successful. Please login");

        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                return res.status(404).send("User not found");
            }

            if(existingUser.suspended == true){
                return res.status(403).send("Your account has been suspended");
            }

            if (await bcrypt.compare(password, existingUser.password)) {
                const token_user = { email: existingUser.email, id: existingUser._id, username: existingUser.username, role: existingUser.role};
                const accessToken = generateAccessToken(token_user);
                const response = {message: "Login successful", accessToken: accessToken,username: existingUser.username}
                //console.log(accessToken)
                res.status(201).send(response)
            } else {
                return res.status(400).send('Invalid credentials');
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    profile: async (req, res) => {
        try {
            const username = req.params.username;
            const currentUser = req.user.username;

            if (username == currentUser) {
                const userInfo = await User.findOne({username}).select('-suspended -password -__v -_id -role');

                const userId = req.user.id;
                const reviews = await Review.find({user: userId}).populate({path:'teacher', select:'name ID -_id'}).select('-__v -user -likes -dislikes')

                const userProfile = {
                    userInfo,
                    reviews,
                };

                return res.json(userProfile);
            }
            
            //Added functionality for looking at other people's profiles
            else if (username != currentUser) {
                //const userId = await User.findOne({username}).select('username _id');
                //const reviews = await Review.find({user: userId}).populate({path:'teacher', select:'name -_id'}).select('-_id -__v -user')

                //const userProfile = {
                //    reviews,
                //};
                return res.status(403).json({ message: 'You are not authorized to view this profile' });
            } 

        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      },

      delete: async (req, res) => {
        try {
            const userId = req.user.id;
            //const user = await User.findById(userId).select('_id');
            //await Review.deleteMany({ user: userId });

            const reviews = await Review.find({ user: userId });

            if (reviews.length > 0) {
                for (const review of reviews) {
                    review.user = null;
                    await review.save();
                }
            }

            const reviewsWithActions = await Review.find({
                $or: [{ likes: userId }, { dislikes: userId }],
            });

            if (reviewsWithActions.length > 0) {
            reviewsWithActions.forEach(async (review) => {
                if (review.likes.includes(userId)) {
                        review.likes.pull(userId);
                        review.numOfLikes -= 1;
                    }
                    if (review.dislikes.includes(userId)) {
                        review.dislikes.pull(userId);
                        review.numOfDislikes -= 1;
                    }
                    await review.save();
                });
            }

            await User.findByIdAndRemove({ _id: userId})
            return res.status(200).json({ message: 'User deleted successfully' });
            
        
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      },

      getSettings: async (req, res) => {
        const currentUser = req.user.id;
        try{
            const user = await User.findById(currentUser).select('-suspended -role -password -__v -_id');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
            else{
                return res.status(200).json(user);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
      },

      updateSettings: async (req, res) => {
        const currentUser = req.user.id;
        try{
            const { firstName, lastName, username, email, erp } = req.body;
            const result = await User.findByIdAndUpdate(currentUser, {
                firstName: firstName,
                lastName: lastName,
                username: username,
                erp: erp,
                email: email,
            });
            res.status(201).send("Update Successful");
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
      },

      changePassword: async (req, res) => {
        const currentUser = req.user.id;
        try {
            const { currentPassword, newPassword, confirmNewPassword } = req.body;
            if (!(currentPassword && newPassword && confirmNewPassword)) {
                return res.status(400).send("All input is required");
            }
            if (
                newPassword.length < 8 ||              // Minimum length of 8 characters
                !/[a-z]/.test(newPassword) ||         // At least one lowercase letter
                !/[A-Z]/.test(newPassword) ||         // At least one uppercase letter
                !/[0-9]/.test(newPassword)            // At least one number
            ) 
            {
                return res.status(400).send("Password should be minimum 8 characters long and should include one lowercase letter, one uppercase letter, and at least one number");
            }

            if (currentPassword == newPassword) {
                return res.status(400).send("New password cannot be the same as your current password");
            }

            const user = await User.findById(currentUser).select('password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
            else{
                if (await bcrypt.compare(currentPassword, user.password)) {
                    if (newPassword == confirmNewPassword) {
                        const hashedPassword = await bcrypt.hash(newPassword, 10);
                        const result = await User.findByIdAndUpdate(currentUser, {
                            password: hashedPassword
                        });
                        res.status(201).send("Password Changed Successfully");
                    }
                    else{
                        return res.status(400).send("Passwords do not match. Try Again.");
                    }
                }
                else{
                    return res.status(400).send("Your existing password is incorrect");
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });   
        }
      },

      logout: async (res) => {
        res.set('Authorization', 'Bearer expired-token');
        res.status(200).json({ message: 'Logout successful' });
      },

      reportReview: async (req, res) => {
        try{
            const reviewId = req.params.id;
            const {reason} = req.body;
            const userId = req.user.id; 

            const exist = await Report.find({ review: reviewId, user: userId })
            if (exist.length > 0) {
                return res.status(400).json({ message: 'You have already reported this review' });
            }

            const review = await Review.findById({_id: reviewId}).select('_id user');
            if (!review) {
              return res.status(404).json({ message: 'Review not found' });
            }

            if (review.user == userId) {
                return res.status(403).json({ message: 'You cannot report your own review' });
            }
        
            const report = new Report({
              review: reviewId,
              user: userId,
              reason: reason,
            });
        
            await report.save();
        
            res.status(201).json({ message: 'Review reported successfully' });
        
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
      },

     uploadAvatar: async (req, res) => {
        try {
            const username = req.params.username;
            const userid = await User.find({username: username}).select('_id');
            if (!userid){
                return res.status(404).json({ message: 'User not found' });
            }
            if (!req.file) {
              return res.status(400).send('No file uploaded');
            }

            const fileName = req.file.filename;
            //const filePath = `${fileName}`;
            const filePath = `/uploads/${fileName}`;

            const result = await User.findByIdAndUpdate(userid, { img: filePath });

            res.status(201).send('File uploaded successfully');

     } catch(error)
        {
            console.log(error);
            return res.status(500).send("Server Error");
        }

    }
}


module.exports = UserController;