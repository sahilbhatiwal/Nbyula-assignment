require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const passport = require("passport");
const morgan = require("morgan");
const connectWithDB = require("./utils/db");
const { request } = require("http");
connectWithDB();

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

// error handler
app.use("*",(err,req,res,next)=>{
    if(err)
    {
        console.log(err);
        return res.status(500).json({
            success:false,
            message: err.message
        })
    }
    else{
        return res.status(404).json({
            success:false,
            message: "Page Not Found 💀☠️"
        })
    }
})

// test routes
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message: "Welcome to Quiz app"
    })
})

app.listen(PORT ,()=>{
    console.log(`🚀 App started on PORT ${PORT}`);
})