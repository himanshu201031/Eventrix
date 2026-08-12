const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Not authorized, no token");
  }

  const token = header.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError("Not authorized, token failed");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new UnauthorizedError("Not authorized, user not found");
  }

  req.user = user;
  next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  throw new ForbiddenError("Not authorized as an admin");
};

module.exports = { protect, admin };
