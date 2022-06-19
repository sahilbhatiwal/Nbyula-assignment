const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const QuizAttempt = new mongoose.Schema({
    Quiz : {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "Quiz is required"],
    },
    User : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    AttemptedQuestions : [{
        question : {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: [true, "Question is required"],
        },
        answers : [{
            type: Number,
            
            required: [true, "Answer is required"],
        }],
    }],
    Score : {
        type: Number,
        required: [true, "Score is required"],
        min: [0, "Score should be greater than 0"],
    },
    StartTime : {
        type: Date,
        required: [true, "Start Time is required"],
    }
});

module.exports = mongoose.model("QuizAttempt", QuizAttempt);
