const express = require("express");
const { startQuiz, getNextQuestion, submitQuestion, getMyQuizAttempts, checkTime } = require("../controllers/quizAttempt");

const router = express.Router();
const { isLoggedIn, isCustomRole } = require("../middlewares/user");

// start quiz
router.post("/test", isLoggedIn, startQuiz);
router.get("/test/:id/nextquestion", isLoggedIn,checkTime, getNextQuestion);
router.put("/test/:id/question", isLoggedIn,checkTime, submitQuestion);
router.get("/getmyQuiz",isLoggedIn,getMyQuizAttempts);

module.exports = router;
