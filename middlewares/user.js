const User = require("../models/user");
const BigPromise = require("../utils/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

// checked if is logged in
exports.isLoggedIn = BigPromise(async (req, res, next) => {
  // check the token in cookei or header or the body
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("You are not logged in", 401));
  }

  // get decode jwt token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new CustomError("User does not exist", 400));
  }

  req.user = user;
  next();
});

// check for custom role
exports.isCustomRole = (...roles) =>
  BigPromise(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError("you are not allowed to access the resource", 401)
      );
    }

    next();
  });
