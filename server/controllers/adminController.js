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
}

module.exports = adminController