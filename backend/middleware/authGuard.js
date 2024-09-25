const jwt = require("jsonwebtoken");
const Users = require("../model/userModel");

const authGuard = async(req, res, next) => {
  // get header authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json({
      success: false,
      message: "Authorization header not found",
    });
  }

  // get token by spliting the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.json({
      success: false,
      message: "Token not found",
    });
  }
  try {
    // verify token
    const decodeUser = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = await Users.findById(decodeUser.id).select("-password");
    next();
  } catch (e) {
    res.json({
      success: false,
      message: "Invalid Token",
    });
  }
};
module.exports = authGuard;
