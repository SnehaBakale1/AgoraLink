const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({
        message: error.message
      });
    }
  } else {
    return res.status(401).json({
      message: "Not Authorized, Token not Found"
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      return next();
    } else {
      return res.status(403).json({
        message: "Not Authorized Admin"
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Not Authorized Admin"
    });
  }
};

module.exports = { protect, isAdmin };
