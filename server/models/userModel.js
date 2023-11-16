const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {type: String, default: null,required: true},
    lastName: {type: String, default:null, required: true },
    username: {type: String, unique: true, required: true},
    erp: {type: Number, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role:{ type: String, enum: ['user', 'admin'],required: true},
    suspended: {type: Boolean, default: false},
    img: {type: String, default: null},
})

const User = mongoose.model('User', userSchema);
module.exports = User