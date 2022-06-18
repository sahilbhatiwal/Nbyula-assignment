const cookieToken = (user, res) => {
  // create token
  // accpets user and request
  const token = user.getJwtToken();

  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = cookieToken;
