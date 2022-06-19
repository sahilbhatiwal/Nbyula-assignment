// import quiz model
const quizModel = require("../models/quiz");
const CourseModel = require("../models/course");
const BigPromise = require("../utils/bigPromise");
const QuizAttemptModel = require("../models/quizAttempt");
const QuestionModel = require("../models/question");
const CustomError = require("../utils/customError");

// start quiz
exports.startQuiz = BigPromise(async (req, res, next) => {
  const { QuizId } = req.body;

  if (!QuizId) {
    return next(new CustomError("Quiz Id is required", 400));
  }

  const quiz = await quizModel.findById(QuizId);

  if (!quiz) {
    return next(new CustomError("Quiz not found", 400));
  }

  // check if user not started earlier
  const quizAttemptearly = await QuizAttemptModel.findOne({
    User: req.user._id,
    Quiz: QuizId,
  });
  if (quizAttemptearly) {
    return next(new CustomError("You have already started this quiz", 400));
  }

  const quizAttempt = new QuizAttemptModel({
    Quiz: QuizId,
    User: req.user._id,
    AttemptedQuestions: [],
    Score: 0,
    StartTime: new Date(),
  });
  await quizAttempt.save();
  res.status(200).json({
    success: true,
    data: quizAttempt,
  });
});

// get next question
exports.getNextQuestion = BigPromise(async (req, res, next) => {
  // const { QuizAttemptId } = req.body;
  const { id } = req.params;
  const quizAttempt = await QuizAttemptModel.findById(id).populate(
    "Quiz",
    "Questions"
  );
  if (!quizAttempt) {
    return next(new CustomError("Quiz Attempt not found", 400));
  }

  const { Quiz } = quizAttempt;
  const { Questions } = Quiz;
  const { AttemptedQuestions } = quizAttempt;

  // get question not attempted
  const questionNotAttempted = Questions.filter((question) => {
    return !AttemptedQuestions.some((attemptedQuestion) => {
      return attemptedQuestion.question.toString() === question._id.toString();
    });
  });

  console.log("question", questionNotAttempted);
  if (questionNotAttempted.length == 0) {
    console.log("no question");
    res.status(200).json({
      success: true,
      data: {
        Score: quizAttempt.Score,
        QuizID: Quiz._id,
        AttemptID: quizAttempt._id,
      },
      message: "No more questions",
    });
    return;
  }

  const que = questionNotAttempted[0];
  const questionId = que._id.toString();

  // get question options

  const question = await QuestionModel.findById(questionId).select("-Answers");
  if (!question) {
    return next(new CustomError("Question not found", 400));
  }

  console.log(question);

  res.status(200).json({
    success: true,
    data: question,
  });
});

// submit question
exports.submitQuestion = BigPromise(async (req, res, next) => {
  const { id } = req.params;
  const { QuestionId, Answers } = req.body;

  if (!QuestionId || !Answers) {
    return next(new CustomError("Question Id and Answers are required", 400));
  }

  const quizAttempt = await QuizAttemptModel.findById(id).populate(
    "Quiz",
    "Questions"
  );
  if (!quizAttempt) {
    return next(new CustomError("Quiz Attempt not found", 400));
  }

  const { Quiz } = quizAttempt;
  const { Questions } = Quiz;
  const { AttemptedQuestions } = quizAttempt;

  // check if answer are valid
  var question = await QuestionModel.findById(QuestionId);
  if (!question) {
    return next(new CustomError("Question not found", 400));
  }

  console.log(question);

  const questionAnswers = question.Answers;
  // console.log(questionAnswers)

  // check if question not already attempted
  const questionAlreadyAttempted = AttemptedQuestions.some(
    (attemptedQuestion) => {
      return attemptedQuestion.question.toString() === QuestionId.toString();
    }
  );
  if (questionAlreadyAttempted) {
    return next(new CustomError("Question already attempted", 400));
  }

  // check if answers are valid
  var score = true;

  const answers = Answers.map((answer) => {
    // if answer existes in answer2
    const answer2 = questionAnswers.find((answer2) => {
      return answer2.toString() === answer.toString();
    });
    if (!answer2) {
      score = false;
    }
  });

  if (!score) {
    quizAttempt.AttemptedQuestions.push({
      question: QuestionId,
      answers: Answers,
    });
    await quizAttempt.save();

    return res.status(200).json({
      success: false,
      data: quizAttempt,
      message: "Answer is invalid",
    });
  }

  // update the score
  else {
    const { Score } = quizAttempt;
    const newScore = Score + question.Point;
    quizAttempt.Score = newScore;
    quizAttempt.AttemptedQuestions.push({
      question: QuestionId,
      answers: Answers,
    });
    await quizAttempt.save();

    return res.status(200).json({
      success: true,
      data: quizAttempt,
    });
  }
});

// get my quizs attempts
exports.getMyQuizAttempts = BigPromise(async (req, res, next) => {
  const quizAttempts = await QuizAttemptModel.find({
    User: req.user._id,
  }).populate("Quiz", "Name");
  if (!quizAttempts) {
    return next(new CustomError("Quiz Attempt not found", 400));
  }

  var totalScore = 0;
  quizAttempts.forEach((quizAttempt) => {
    totalScore += quizAttempt.Score;
  });

  res.status(200).json({
    success: true,
    data: {
      quizAttempts,
      totalScore,
    },
  });
});

// middleware to check time
exports.checkTime = BigPromise(async (req, res, next) => {
    const { id } = req.params;
    const quizAttempt = await QuizAttemptModel.findById(id).populate("Quiz"," MaxTime");
    if (!quizAttempt) {
        return next(new CustomError("Quiz Attempt not found", 400));
    }

    const { Quiz } = quizAttempt;
    const { MaxTime } = Quiz;
    const { StartTime } = quizAttempt;
    const timeDiff = Math.abs(new Date() - StartTime);
    const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    console.log(diffMinutes);
    if (diffMinutes > MaxTime) {
        return next(new CustomError("Time is up", 400));
    }

    next();
});
