const express = require("express");
const { addquiz, getquiz, getquizbyId, updatequizbyId, deletequizbyId } = require("../controllers/quiz");

const router = express.Router();
const { isLoggedIn, isCustomRole } = require("../middlewares/user");

//add course
router.post("/quiz", isLoggedIn, isCustomRole("admin", "teacher"), addquiz);

//get all course
router.get("/quiz", isLoggedIn, getquiz);

//getquizbyId
router.get("/quiz/:id", isLoggedIn, getquizbyId);

//update quiz
router.put(
  "/quiz/:id",
  isLoggedIn,
  isCustomRole("admin", "teacher"),
  updatequizbyId
);
//delete quiz
router.delete(
  "/quiz/:id",
  isLoggedIn,
  isCustomRole("admin", "teacher"),
  deletequizbyId
);

module.exports = router;
