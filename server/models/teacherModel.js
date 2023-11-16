const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ID: { type: String, required: true },
    faculty_type: { type: String, required: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
})

const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher