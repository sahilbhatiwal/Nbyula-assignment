require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const morgan = require("morgan");
const connectWithDB = require("./utils/db");
// const { request } = require("http");
connectWithDB();
const CustomError = require("./utils/customError");

// middlewares

// regular express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // initilaise passport
// app.use(passport.initialize());

// morgan middle wares
app.use(morgan("tiny"));

const PORT = process.env.PORT || '3000';

// test routes
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message: "Welcome to Quiz app"
    })
})

// import all routes
const user = require("./routes/user");
const course = require("./routes/course");

// router middlewares
app.use("/api/v1", user);
app.use("/api/v1", course);

// error handler
app.use((err,req,res,next)=>{
    if (err instanceof CustomError) {
      
      console.log(err.message);
      return res.status(err.code).json({
        success: false,
        message: err.message,
      });
    }

    // check if any other error
    return res.status(500).json({
      success: false,
      message: err.message,
    });
})

app.listen(PORT ,()=>{
    console.log(`🚀 App started on PORT ${PORT}`);
})