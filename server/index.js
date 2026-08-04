const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


dotenv.config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>{
    console.log(err);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})