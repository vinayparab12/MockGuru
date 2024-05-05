const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    interview:[
        {
            questionId: {
                type: Number,
                required: true
            },
            answer: {
                type: String,
                required: true
            },
            interviewAttempt: {
                type: Number,
                default: true
            },
        }
    ],
    
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

module.exports = UserAnswer;
