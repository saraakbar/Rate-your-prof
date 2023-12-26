const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ID: { type: String, required: true, unique: true},
  location: { type: String, required: true },
  logo: {type: String, default: null},
});

const University = mongoose.model('University', universitySchema);

module.exports = University;
