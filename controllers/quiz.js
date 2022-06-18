// import quiz model
const quiz = require("../models/quiz");
const CourseModel = require("../models/course");
const BigPromise = require("../utils/bigPromise");
const CustomError = require("../utils/customError");

// get all quiz
const getquiz = BigPromise(async (req, res, next) => {
  const data = await quiz.find();
  if (!data) {
    return next(new CustomError("quiz not found", 400));
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});

// get quiz by id
const getquizbyId = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  const data = await quiz
    .findById(id)
    .populate("Questions", "Question Options  Point");
    
  if (!data) {
    return next(new CustomError("quiz not found", 400))
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});

// update quiz by id
const updatequizbyId = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  const {PassingMarks, TopicTags } = req.body;

  const data = await quiz
    .findByIdAndUpdate(id, { PassingMarks, TopicTags });
    
  if (!data) {
    return next(new CustomError("Id Does not exist", 400));
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});

// delete quiz by id
const deletequizbyId = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  var data = await quiz.findByIdAndDelete(id);
  if (data) {
    return res.status(200).json({
      success: true,
      message: "quiz deleted",
      data: data,
    });
  } else {
    return next(new CustomError("quiz does not exist", 400));
  }
});

// add a quiz
const addquiz = BigPromise(async (req, res, next) => {
  // get quizdetail form body
  const { Course,PassingMarks, TopicTags } = req.body;
  if (!Course || !PassingMarks) {
    return next(new CustomError("Course and passing marks are required", 400));
  }

  // check if course exists
  const course = await CourseModel.findById(Course);
  if (!course) {
    return next(new CustomError("Course does not exist", 400));
  }

  const data = await quiz.create({
    Course, PassingMarks, TopicTags
  });

  course.Quiz= data._id;
  await course.save();
  
  res.status(200).json({
    success: true,
    message: "quiz added",
    data: data,
  });
});

// export the controllers
module.exports = {
  getquiz,
  addquiz,
  getquizbyId,
  updatequizbyId,
  deletequizbyId,
};
