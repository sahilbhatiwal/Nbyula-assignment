const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signup,
  login,
  logout,
  getMe,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  verifytoken,
} = require("../controllers/user");
const { isLoggedIn, isCustomRole } = require("../middlewares/user");
const cookieToken = require("../utils/cookieToken");

// login routes
router.post("/signup", signup);
router.post("/login", login);

router.get("/logout", isLoggedIn, logout);

// user routes
router.get("/userdashboard", isLoggedIn, getMe);

// admin routes
router.get("/admin/users", isLoggedIn, isCustomRole("admin"), getAllUsers);
router.get("/admin/user/:id", isLoggedIn, isCustomRole("admin"), getUserById);
router.put(
  "/admin/user/:id",
  isLoggedIn,
  isCustomRole("admin"),
  updateUserById
);
router.delete(
  "/admin/user/:id",
  isLoggedIn,
  isCustomRole("admin"),
  deleteUserById
);

module.exports = router;
