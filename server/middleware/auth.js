const jwt=require("jsonwebtoken");

const User=require('../models/User.js');

const protect=async (req,res,next)=>{
    let token=req.header.authorization && req.header.authorization.startsWith("Bearer")?req.header.authorization.split(" ")[1]:null;
    if(!token){
        return res.status(401).json({message:"Not authorized, no token"});
    }
}
