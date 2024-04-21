const jwt = require("jsonwebtoken");
// const dotnev = require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { admin } = require("../models/Admin/AdminModel");

const requireAdminAuth = asyncHandler(async (req, res, next) => {

  const token = req.cookies[process.env.ADMIN_TOKEN];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.admin = await admin
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
      message: "you are not authorized",
      state: false,
    });
    next();
  }
});

module.exports = { requireAdminAuth };
