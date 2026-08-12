const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp.js");
const { sendOtpEmail } = require("../utils/email.js");
const { logger } = require("../utils/logger");
const {
  ValidationError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ValidationError("Username, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ConflictError("User already exists");

  const existingName = await User.findOne({ username });
  if (existingName) throw new ConflictError("Username already taken");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: "user",
    isVerified: false,
  });

  const otp = generateOtp();

  await Otp.create({ email, otp, action: "Acc_verify" });

  // Email delivery must not roll back a successful registration
  try {
    await sendOtpEmail(email, otp, "register");
  } catch (err) {
    logger.error("Failed to send registration OTP email", { email, message: err.message });
  }

  res.status(201).json({
    message: "User registered successfully. Please verify your email.",
    email: user.email,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // Same message for both cases — don't reveal whether an email exists
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isVerified && user.role === "user") {
    const otp = generateOtp();
    await Otp.deleteMany({ email, action: "Acc_verify" });
    await Otp.create({ email, otp, action: "Acc_verify" });
    await sendOtpEmail(email, otp, "login");

    return res.status(400).json({
      message: "Account not verified. OTP sent to email.",
      needsVerification: true,
    });
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    },
  });
};

exports.verifyotp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ValidationError("Email and OTP are required");
  }

  const otpRecord = await Otp.findOne({ email, otp, action: "Acc_verify" });
  if (!otpRecord) {
    throw new ValidationError("Invalid or expired OTP");
  }

  // select("-password") — never return the hash in a response
  const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true }).select("-password");
  if (!user) throw new NotFoundError("User not found");

  await Otp.deleteMany({ email, action: "Acc_verify" });

  res.status(200).json({
    message: "Account verified successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    },
  });
};
