const User = require("../models/user");
const BigPromise = require("../utils/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const cookieToken = require("../utils/cookieToken");

// signup route
exports.signup = BigPromise(async (req, res, next) => {
  
  const { name, email, password } = req.body;
  // check for name, email, password
  if (!email || !password || !name) {
    return next(new CustomError("name email and password are required", 400));
  }

  // check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return next(new CustomError("User already exists", 400));
  }

  const tempuser = new User({
    name,
    email
  });

  // register the user
  User.register(tempuser, password, (err, user) => {
    if (err) {
      return next(new CustomError(err.message, 400));
    }

    user.salt = undefined;
    user.hash = undefined;

    // create a token in response
    return cookieToken(user, res);
  });
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // check for email and password
  if (!email || !password) {
    return next(new CustomError("email and password are required", 400));
  }

  // authenticate the user
  const { user } = await User.authenticate()(email, password);
  if (!user) {
    return next(new CustomError("Invalid email or password", 400));
  }

  user.salt = undefined;
  user.hash = undefined;

  return cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  // req.logout();
  res.json({
    succes: "true",
    message: "logged out successfully",
  });
});

// get logged in user details
exports.getMe = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.json({
    succes: true,
    data: user,
  });
});

// get all the users
exports.getAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

// get user by id
exports.getUserById = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // check if id is valid
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  res.json({
    succes: true,
    data: user,
  });
});

// update user by id
exports.updateUserById = BigPromise(async (req, res, next) => {
  // check for name and email
  const {role } = req.body;
  if (!role) {
    return next(new CustomError("role is required", 400));
  }

  const newData = {
    role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.json({
    succes: true,
    data: user,
  });
});

// delete user by id
exports.deleteUserById = BigPromise(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  // check if id is valid
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  res.json({
    succes: true,
    data: user,
  });
});
