const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const QuestionSchema= new mongoose.Schema({
    Quiz : {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "Quiz is required"],
    },
    Question : {
        type: String,
        required: [true, "Question is required"],
        maxlength: [500, "Question is too long"],
        trim: true,
    },
    Options : [{
        id : {
            type: Number,
            
            required: [true, "Option id is required"],
        },
        value : {
            type: String,
            required: [true, "Option value is required"],
        },
    }],
    Answers : [{
        type: Number,
        required: [true, "Answer is required"],
    }],
    Point : {
        type: Number,
        required: [true, "Point is required"],
        min: [0, "Point should be greater than 0"],
        max : [10, "Point should be less than 100"],
    },
});

module.exports = mongoose.model("Question", QuestionSchema);
