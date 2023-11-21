const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  criteria: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Criteria' }],
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
