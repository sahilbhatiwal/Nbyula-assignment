const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Course", courseSchema);
