const express = require("express");
const { addCourse, getCourse, getCoursebyId, updateCoursebyId, deleteCoursebyId } = require("../controllers/course");
const router = express.Router();
const { isLoggedIn, isCustomRole } = require("../middlewares/user");

//add course
router.post("/course",isLoggedIn,isCustomRole("admin", "teacher"),addCourse);

//get all course
router.get("/course",isLoggedIn,getCourse);

//getCoursebyId
router.get("/course/:id",isLoggedIn, getCoursebyId);

//update course
router.put("/course/:id",isLoggedIn,isCustomRole("admin", "teacher"), updateCoursebyId);
//delete course
router.delete("/course/:id",isLoggedIn,isCustomRole("admin", "teacher"), deleteCoursebyId);

module.exports = router;
