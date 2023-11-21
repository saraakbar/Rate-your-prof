const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const Criteria = mongoose.model('Criteria', criteriaSchema);

module.exports = Criteria;
