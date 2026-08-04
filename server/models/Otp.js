const mongoose = require("mongoose");
const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: ['Acc_verify', 'event_booking'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP expires after 5 minutes
    }
});

module.exports = mongoose.model("Otp", OtpSchema);