const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Please tell us your name!"],
    maxlength: [50, "Course Name is Mandatory"],
    trim: true,
  },
  Code: {
    type: String,
    unique: true,
    trim: true,
  },
  Teacher: {
    type : Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Teacher is required"],
  },
  Quiz : {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  }
});

module.exports = mongoose.model("Course", courseSchema);
