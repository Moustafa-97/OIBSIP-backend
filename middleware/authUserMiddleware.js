const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { user } = require("../models/User/UserModel");

const requireUserAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies[process.env.USER_TOKEN];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.user = await user
        .findById(decoded.ID)
        .select(["-password", "-confirmPassword"]);
    } catch (err) {
      res
        .status(401)
        .json({ message: "you are not authorized, validity", state: false });
    }
    next();
  } else {
    res.status(401).json({
      message: "you are not authorized, please login",
      state: false,
    });
    next();
  }
});

module.exports = { requireUserAuth };
