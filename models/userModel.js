const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {type: String, default: null,required: true},
    lastName: {type: String, default:null, required: true },
    username: {type: String, unique: true, required: true},
    erp: {type: Number, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
})

const User = mongoose.model('User', userSchema);
module.exports = User