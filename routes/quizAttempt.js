const express = require("express");
const { startQuiz, getNextQuestion, submitQuestion } = require("../controllers/quizAttempt");

const router = express.Router();
const { isLoggedIn, isCustomRole } = require("../middlewares/user");

// start quiz
router.post("/test", isLoggedIn, startQuiz);
router.get("/test/:id/nextquestion", isLoggedIn, getNextQuestion);
router.put("/test/:id/question", isLoggedIn, submitQuestion);

module.exports = router;
