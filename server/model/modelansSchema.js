// models/ModelAnswer.js
const mongoose = require('mongoose');

const ModelAnswerSchema = new mongoose.Schema({
  type: String,
  answers: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Model_Answers', ModelAnswerSchema);
