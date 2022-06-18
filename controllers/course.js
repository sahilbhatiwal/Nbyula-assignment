// import Course model
const Course = require("../models/course");
const BigPromise = require("../utils/bigPromise");
const CustomError = require("../utils/customError");

const getCourse = BigPromise(async (req, res, next) => {

    const data = await Course.find();
    if (!data) {
      return next(new CustomError("course not found", 400));
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  }
);

// get Course by id
const getCoursebyId = BigPromise(async (req, res, next) => {
  const id = req.params.id;
    const data = await Course.findById(id);
    if (!data) {
      return next(new CustomError("Course not found", 400));
    }
    res.status(200).json({
      success: true,
      data: data,
    });
});

// update Course by id
const updateCoursebyId = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  const { Name } = req.body;
    if (!Name) {
      return next(new CustomError("Course not updated", 400));
    }
    const data = await Course.findByIdAndUpdate(id, {Name});
    if (!data) {
      return next(new CustomError("Id Does not exist", 400));
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  }
);

// delete Course by id
const deleteCoursebyId = BigPromise(async(req, res, next) => {

  const id = req.params.id;
  var data = await Course.findByIdAndDelete(id);
  if (data) {
    return res.status(200).json({
      success: true,
      message: "Course deleted",
      data: data,
    });
  } else {
    return next(new CustomError("Course does not exist", 400));
  }
});

// add a course
const addCourse = BigPromise(async (req, res, next) => {
  // get Coursedetail form body
    const { Name, Code } = req.body;
    if (!Name || !Code) {
      return next(new CustomError("name and code required", 400));
    }
    const data = await Course.create({
      Name,
      Code,
    });
    res.status(200).json({
      success: true,
      message: "Course added",
      data: data,
    });
});

// export the controllers
module.exports = {
  getCourse,
  addCourse,
  getCoursebyId,
  updateCoursebyId,
  deleteCoursebyId,
};
