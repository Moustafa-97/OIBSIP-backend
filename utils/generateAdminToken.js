const jwt = require("jsonwebtoken");

module.exports.GenerateAdminToken = (res, ID, next) => {
  const maxAge = 3 * 24 * 60 * 60 * 1000;
  const token = jwt.sign({ ID }, process.env.SECRET_KEY, { expiresIn: "7d" });

  res.cookie(process.env.ADMIN_TOKEN, token, {
    withCredentials: true,
    httpOnly: true,
    maxAge: maxAge,
  });
};
