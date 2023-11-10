const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const Report = require('../models/reportedModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2200s' })
}

const adminController = {
    login: async (req, res) => {
        const { username, password } = req.body;
        try{
            const admin = await User.findOne({username: username});
            if (!admin) return res.status(400).send("User does not exist");

            if (await bcrypt.compare(password, admin.password)) {
                const token_user = {id: admin._id, username: admin.username, role: admin.role};
                const accessToken = generateAccessToken(token_user);
                const response = { message: "Login successful"}
                console.log(accessToken);
                res.status(201).send(response)
            } else {
                return res.status(400).send('Invalid credentials');
            }
        } catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    reports: async (req, res) => {
        try{
            const reports = await Report.find()
            .populate({path: 'user',select:'username'})
            .populate({
                path: 'review',
                select: '_id',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
            .select('-__v -_id')
            res.status(200).send(reports);
        } catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

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
            await Review.findByIdAndDelete(id: id);
            res.status(200).send("Review deleted");
        } catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    }

    deleteUser: async (req, res) => {
        try{
            const {username} = req.params;
            await User.findAndDelete(username: username);
            res.status(200).send("User deleted");
        } catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    suspendUser: async (req, res) => {
        try{ 
            const {username} = req.params;
            await User.findAndUpdate(username: username, {suspended: true});
            res.status(200).send("User suspended");
        } catch(error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    getUsers: async (req, res) => {
        try{
            const users = await User.find().select('-__v -password');
            res.status(200).send(users);
        } catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

    getUser: async (req, res) => {
        try{
            const {username} = req.params;
            const user = await User.find(username: username).select('-__v -password');
            res.status(200).send(user);
        }catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    },

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

    getReview: async (req, res) => {
        try{
            const {id} = req.params;
            const review = await Review.find(id: id)
            .populate({path: 'user',select:'username'})
            .select('-__v -id')
            res.status(200).send(review);
        }catch (error){
            console.log(error);
            return res.status(500).send("Server Error");
        }
    }

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