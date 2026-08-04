const User=require("../models/User.js");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const nodemailer = require("nodemailer");


exports.register=async(req,res)=>{
    const {username,email,password,role}=req.body;
    try{
        const user=new User({username,email,password,role});
        await user.save();
        res.status(201).json({message:"User registered successfully"});
    } catch(err){
        res.status(500).json({message:"Error registering user",error:err.message});
    }
};

