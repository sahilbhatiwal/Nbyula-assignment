const express = require("express");
const { createQuestion, updateQuestionbyId, deleteQuestionbyId } = require("../controllers/questions");

const router = express.Router();
const { isLoggedIn, isCustomRole } = require("../middlewares/user");

//add course
router.post("/question", isLoggedIn, isCustomRole("admin", "teacher"), createQuestion);

//get all course
// router.get("/question", isLoggedIn, g);

//getquestionbyId
// router.get("/question/:id", isLoggedIn, getquestionbyId);

//update question
router.put(
  "/question/:id",
  isLoggedIn,
  isCustomRole("admin", "teacher"),
  updateQuestionbyId
);
//delete question
router.delete(
  "/question/:id",
  isLoggedIn,
  isCustomRole("admin", "teacher"),
  deleteQuestionbyId
);

module.exports = router;
