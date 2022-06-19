const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const QuizSchema = new mongoose.Schema({
  Course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course is required"],
  },
  Questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question is required"],
    },
  ],
  PassingMarks: {
    type: Number,
    required: [true, "Passing Marks is required"],
    min: [0, "Passing Marks should be greater than 0"],
  },
  TopicTags: [
    {
      type: String,
    },
  ],
  MaxTime: {
    type: Number,
    required: [true, "Max Time is required"],
    min: [0, "Max Time should be greater than 0"],
    max: [60, "Max Time should be less than 60"],
  }
});

module.exports = mongoose.model("Quiz", QuizSchema);
