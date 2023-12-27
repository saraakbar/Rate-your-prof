const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const Report = require('../models/reportedModel')
const University = require('../models/universityModel');
const Department = require('../models/departmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7200s' })
}

const adminController = {
    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const admin = await User.findOne({ username: username });
            if (!admin) return res.status(404).send("User does not exist");

            if (await bcrypt.compare(password, admin.password)) {
                const token_user = { id: admin._id, username: admin.username, role: admin.role };
                const accessToken = generateAccessToken(token_user);
                const response = { message: "Login successful", accessToken: accessToken }
                res.status(201).send(response)
            } else {
                return res.status(400).send('Invalid credentials');
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    reports: async (req, res) => {
        try {
            const reports = await Report.find()
                .populate({ path: 'user', select: 'username' })
                .populate({
                    path: 'review',
                    select: '_id',
                    populate: {
                        path: 'user',
                        select: 'username'
                    }
                })
                .select('-__v')

            const columns = [];

            // Flatten the nested objects into the columns array
            const flattenObject = (obj, parentKey = '') => {
                for (const key in obj) {
                    const newKey = parentKey ? `${parentKey}.${key}` : key;
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        flattenObject(obj[key], newKey);
                    } else {
                        columns.push(newKey);
                    }
                }
            };

            if (reports.length > 0) {
                flattenObject(reports[0].toObject());
            }

            // Remove internal fields from columns
            const sanitizedColumns = columns.filter(key => key !== '__v' && key !== '_id');

            res.status(200).json({ columns: sanitizedColumns, reports });
        } catch (error) {
            console.error("Error fetching reports:", error);
            return res.status(500).send("Server Error");
        }
    },



    createUniversity: async (req, res) => {
        try {
            const { name, ID, location } = req.body;
            await University.create({ name, ID, location });
            res.status(201).json("university created");
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getUniversities: async (req, res) => {
        try {
            const universities = await University.find().select('-__v -logo -ID -departments');
            const universityKeys = universities.length > 0 ? Object.keys(universities[0].toObject()) : [];
            const excludedKeys = [];
            const columns = universityKeys.filter(key => !excludedKeys.includes(key));
            res.status(200).json({ columns, universities });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getUniversity: async (req, res) => {
        const { uni_id } = req.params;
        try {
            const university = await University.findById(uni_id).select('-__v -logo');
            res.status(200).json(university);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    },

    editUniversity: async (req, res) => {
        const { uni_id } = req.params;
        const { name, ID, location } = req.body;
        try {
            const existingID = await University.findOne({ ID: ID });
            if (existingID && existingID._id != uni_id) {
                return res.status(400).send("ID already exists");
            }

            await University.findByIdAndUpdate(uni_id, { name, ID, location });
            console.log("successful")
            res.status(200).send("University updated");
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    getDepts: async (req, res) => {
        try {
            const { uni_id } = req.params;
            const depts = await Department.find({ university: uni_id }).select('-__v -university -criteria');
            const departmentKeys = depts.length > 0 ? Object.keys(depts[0].toObject()) : [];
            const excludedKeys = [];
            const columns = departmentKeys.filter(key => !excludedKeys.includes(key));
            res.status(200).json({ columns, depts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createDepartment: async (req, res) => {
        try {
            const { name, uni_id } = req.body;
            const department = await Department.create({ name, university: uni_id });
            res.status(201).json(department);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    suspendUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(404).send("User not found");
            }

            user.suspended = !user.suspended;
            await user.save();

            res.status(200).json({
                message: `User ${user.suspended ? 'suspended' : 'unsuspended'} successfully.`,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Server Error");
        }
    },

    //get review from report id
    getReview: async (req, res) => {
        try {
            const { id } = req.params;
            const report = await Report.findById(id).select('review -_id');
            const reviewId = report.review;
            const review = await Review.findById(reviewId)
                .populate({
                    path: 'teacher',
                    select: 'name ID -_id',
                })
                .populate({
                    path: 'criteria.criterion',
                    model: 'Criteria',
                    select: 'name description -_id',
                })
                .populate({
                    path: 'user',
                    select: 'username img -_id', // Populate with just the username of the user
                })
                .select('-__v -likes -dislikes -numOfLikes -numOfDislikes')

            res.status(200).send(review);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await User.find({ role: 'user' }).select('-__v -password -img -role');
            const userKeys = users.length > 0 ? Object.keys(users[0].toObject()) : [];
            const excludedKeys = [];
            const columns = userKeys.filter(key => !excludedKeys.includes(key));
            res.status(200).json({ columns, users });
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    //delete user by id
    deleteUser: async (req, res) => {
        const { user_id } = req.params;
        const newUserId = '658b9d04c63ba967ba0b8197';
        try {
            const reviews = await Review.find({ user: user_id });

            if (reviews.length > 0) {
                for (const review of reviews) {
                    review.user = newUserId;
                    await review.save();
                }
            }

            const reviewsWithActions = await Review.find({
                $or: [{ likes: user_id }, { dislikes: user_id }],
            });

            if (reviewsWithActions.length > 0) {
                reviewsWithActions.forEach(async (review) => {
                    if (review.likes.includes(user_id)) {
                        review.likes.pull(user_id);
                        review.numOfLikes -= 1;
                    }
                    if (review.dislikes.includes(user_id)) {
                        review.dislikes.pull(user_id);
                        review.numOfDislikes -= 1;
                    }
                    await review.save();
                });
            }

            await User.findByIdAndRemove({ _id: user_id })
            return res.status(200).json({ message: 'User deleted successfully' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    //delete user by report id
    deleteUserByReport: async (req, res) => {
        const { id } = req.params;
        const newUserId = '658b9d04c63ba967ba0b8197';

        try {
            const report = await Report.findById(id)
                .populate({
                    path: 'review',
                    select: 'user',
                })
                .populate({
                    path: 'review.user',
                    select: '_id',
                });

            const user_id = report.review.user._id;

            const reviews = await Review.find({ user: user_id });

            if (reviews.length > 0) {
                for (const review of reviews) {
                    review.user = newUserId;
                    await review.save();
                }
            }

            const reviewsWithActions = await Review.find({
                $or: [{ likes: user_id }, { dislikes: user_id }],
            });

            if (reviewsWithActions.length > 0) {
                reviewsWithActions.forEach(async (review) => {
                    if (review.likes.includes(user_id)) {
                        review.likes.pull(user_id);
                        review.numOfLikes -= 1;
                    }
                    if (review.dislikes.includes(user_id)) {
                        review.dislikes.pull(user_id);
                        review.numOfDislikes -= 1;
                    }
                    await review.save();
                });
            }

            await User.findByIdAndRemove({ _id: user_id })
            return res.status(200).json({ message: 'User deleted successfully' });

        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    //delete reveiw by report
    deleteReviewByReport: async (req, res) => {
        const { id } = req.params;
        try {
            const report = await Report.findById(id).populate({ path: 'review', select: '_id' });
            const reviewId = report.review._id;

            await Review.findByIdAndDelete(reviewId);
            report.isDeleted = true;
            await report.save();
            res.status(200).send("Review deleted");
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    suspendUserbyReport: async (req, res) => {
        const { id } = req.params;
        try {
            const report = await Report.findById(id)
                .populate({
                    path: 'review',
                    select: 'user',
                })
                .populate({
                    path: 'review.user',
                    select: '_id',
                });

            const userId = report.review.user._id;

            const user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(404).send("User not found");
            }
            if (user.suspended) {
                return res.status(400).send("User is already suspended");
            }
            else {
                user.suspended = true;
                await user.save();
                res.status(200).send("User suspended");
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    resolveReport: async (req, res) => {
        try {
            const { id } = req.params;
            const report = await Report.findById(id);
            if (!report) return res.status(400).send("Report does not exist");
            report.isResolved = true;
            await report.save();
            res.status(200).send("Report resolved");
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    getCount: async (req, res) => {
        try {
            const users = await User.find({ role: 'user' }).countDocuments();
            const reviews = await Review.find().countDocuments();
            const reports = await Report.find().countDocuments();
            const unresolvedReports = await Report.find({ isResolved: false }).countDocuments();
            const response = { users: users, reviews: reviews, reports: reports, unresolvedReports: unresolvedReports };
            res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server Error");
        }
    }

    /*
    createModerator: async (req, res) => {
        try{
            const {username, password} = req.body;
            if (!username || !password) return res.status(400).send("Please enter all fields");
            if (password.length < 8 || !/[a-z]/.test(password) ||!/[A-Z]/.test(password) ||!/[0-9]/.test(password) ) 
            {
                return res.status(400).send("Password must be at least 6 characters");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({username: username, password: hashedPassword, role: 'admin'});
            res.status(200).send(user);
        } catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
    }
    deleteReview: async (req, res) => {
        try{
            const {id} = req.params;
            const report= await Report.findById(id).select('review -_id');
            const reviewId = report.review;
            await Review.findByIdAndDelete(id: reviewId);
            report.isDeleted = true;
            await report.save();
            res.status(200).send("Review deleted");
        } catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    }
 
        getReviews: async (req, res) => {
            try{
                {teacherName} = req.query;
                const reviews = await Review.find({teacherName: teacherName})
                .populate({path: 'user',select:'username'})
                .select('-__v')
                res.status(200).send(reviews);
            } catch (error){
                console.log(error);
                return res.status(500).send("Server Error");
            }
        },
    
        resolveReport: async (req, res) => {
            try{
                const {id} = req.params;
                const report = await Report.findById(id);
                if (!report) return res.status(400).send("Report does not exist");
                report.resolved = true;
                await report.save();
                res.status(200).send("Report resolved");
            } catch (error){
                console.log(error);
                return res.status(500).send("Server Error");
            }
        },
    
        deleteReports: async (req, res) => {
            try{
                await Report.deleteMany({resolved: true,date: {$gte: 30}});
                res.status(200).send("Reports deleted");
            } catch (error){
                console.log(error);
                return res.status(500).send("Server Error");
            }
        }
    
        */

}

module.exports = adminController