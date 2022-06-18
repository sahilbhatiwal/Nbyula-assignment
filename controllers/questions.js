
const QuestionModel = require("../models/question");
const QuizModel = require("../models/quiz");
const BigPromise = require("../utils/bigPromise");
const CustomError = require("../utils/customError");

// create question
exports.createQuestion = BigPromise(async (req, res, next) => {
    const { Question, Answers,Options, Point ,Quiz} = req.body;
    if (!Question || !Answers || !Options || !Point || !Quiz) {
        return next(new CustomError("Question,Answers,Options,Point,Quiz are required", 400));
    }

    // check if quiz exists
    const quiz = await QuizModel.findById(Quiz);
    if (!quiz) {
        return next(new CustomError("Quiz not found", 400));
    }

    const data = await QuestionModel.create({Question,Answers,Options,Point,Quiz});

    quiz.Questions.push(data._id);
    await quiz.save();
    
    if (!data) {
        return next(new CustomError("Question not created", 400));
    }

    res.status(200).json({
        success: true,
        data: data,
    });
});

// update question by id
exports.updateQuestionbyId = BigPromise(async (req, res, next) => {
    const id = req.params.id;
    const { Question, Answers,Options, Point } = req.body;
    if (!Question || !Answers || !Options || !Point ) {
        return next(new CustomError("Question,Answers,Options,Point,Quiz are required", 400));
    }

    const data = await QuestionModel.findByIdAndUpdate(id, {Question,Answers,Options,Point});
    if (!data) {
        return next(new CustomError("Id Does not exist", 400));
    }

    res.status(200).json({
        success: true,
        data: data,
    });
}
);

// delete question by id
exports.deleteQuestionbyId = BigPromise(async(req, res, next) => {
    const id = req.params.id;
    var data = await QuestionModel.findByIdAndDelete(id);
    if (data) {
        return res.status(200).json({
            success: true,
            message: "Question deleted",
            data: data,
        });
    } else {
        return next(new CustomError("Id Does not exist", 400));
    }
});
