const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const Otp = require("../models/Otp.js");
const { sendOtpEmail } = require("../utils/email.js");



const generateToken=(id,role)=>{
    return  jwt.sign({id,role},process.env.JWT_SECRET,{expiresIn:"1d"});
}

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);

    await Otp.create({ email, otp, action: "Acc_verify" });
    await sendOtpEmail(email, otp, "register");

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      email: user.email,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified && user.role === "user") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email, action: "Acc_verify" }); // Remove any existing OTPs for this email
    await Otp.create({ email, otp, action: "Acc_verify" });
    await sendOtpEmail(email, otp, "login");
    return res
      .status(400)
      .json({ message: "Account not verified. OTP sent to email." });
  }



  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role:user.role,
      token: generateToken(user._id,user.role),
    },
  });

};


exports.verifyotp = async (req, res) => {
    const {email,otp}=req.body;

    const otpRecord=await Otp.findOne({email,otp,action:"Acc_verify"});
    if(!otpRecord){
        return res.status(400).json({message:"Invalid or expired OTP"});
    }

    const user=await User.findOneAndUpdate({email},{isVerified:true});
    await Otp.deleteMany({email,action:"Acc_verify"}); // Remove the OTP after successful verification

    res.status(200).json({message:"Account verified successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id,user.role),
        }
    }
    );
};
