const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmail= async(email,username,eventTitle) => {

    try{
        const mailOptions = {
            from: `"Eventrix" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Booking Confirmation | Eventrix",
            html: `
                <p>Hello ${username},</p>
                <p>Your booking for <strong>${eventTitle}</strong> has been confirmed!</p>
                <p>Thank you for choosing Eventrix.</p>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Booking email sent:", info.response);
        return true;
    } catch (error) {
        console.error("❌ Error sending booking email:", error);
        throw error;
    }
};




exports.sendBookingEmail = sendBookingEmail;

exports.sendOtpEmail = async (email, otp, type = "verify") => {
  let subject = "Verify Your Email | Eventrix";
  let title = type === "Verify Your Email" ? "Verify your Eventrix Account":" Confirm Your Action";
  let message = type === "verify"
    ?
    "Use the One-Time Password (OTP) below to verify your email address and continue with your Eventrix account."
    :
    "Use the One-Time Password (OTP) below to verify and Confirm your action. This code expires in 5 minutes.";

  switch (type) {
    case "register":
      subject = "Welcome to Eventrix 🎉";
      title = "Welcome to Eventrix!";
      message =
        "Thanks for joining Eventrix. Verify your email using the OTP below to start booking amazing events.";
      break;

    case "forgot-password":
      subject = "Reset Your Password | Eventrix";
      title = "Password Reset Request";
      message =
        "We received a request to reset your password. Use the OTP below to continue. This code expires in 5 minutes.";
      break;

    case "login":
      subject = "Login Verification | Eventrix";
      title = "Secure Login Verification";
      message =
        "Use the OTP below to securely sign in to your Eventrix account.";
      break;

    default:
      break;
  }

  const mailOptions = {
    from: `"Eventrix" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: `Your Eventrix OTP is ${otp}. It expires in 5 minutes.`,

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f5f7fb;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td align="center" style="background:#7c3aed;padding:40px;">

<div style="width:75px;height:75px;border-radius:50%;background:#ffffff;color:#7c3aed;font-size:34px;font-weight:bold;line-height:75px;">
🎟️
</div>

<h1 style="margin:20px 0 8px;color:#ffffff;font-size:30px;">
Eventrix
</h1>

<p style="margin:0;color:#ede9fe;font-size:15px;">
Book. Discover. Experience.
</p>

</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:45px;">

<h2 style="margin-top:0;color:#111827;">
${title}
</h2>

<p style="font-size:16px;color:#4b5563;line-height:1.8;">
Hello,
</p>

<p style="font-size:16px;color:#4b5563;line-height:1.8;">
${message}
</p>

<div style="text-align:center;margin:40px 0;">

<p style="color:#6b7280;font-size:15px;margin-bottom:15px;">
Your One-Time Password
</p>

<div style="
display:inline-block;
padding:18px 40px;
font-size:36px;
font-weight:bold;
letter-spacing:12px;
background:#f3e8ff;
border:2px dashed #7c3aed;
border-radius:12px;
color:#7c3aed;
">
${otp}
</div>

</div>

<div style="
background:#faf5ff;
border-left:4px solid #7c3aed;
padding:18px;
border-radius:8px;
">

<p style="margin:0;font-size:15px;color:#374151;">
⏰ <strong>Expires in:</strong> 5 Minutes
</p>

</div>

<h3 style="margin-top:35px;color:#111827;">
Security Reminder
</h3>

<ul style="padding-left:20px;color:#6b7280;line-height:1.9;">
<li>Never share your OTP with anyone.</li>
<li>Eventrix will never ask for your OTP.</li>
<li>If you didn't request this code, simply ignore this email.</li>
</ul>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:40px 0;">

<p style="font-size:14px;color:#9ca3af;text-align:center;line-height:1.7;">
This is an automated email from <strong>Eventrix</strong>.<br>
Please do not reply to this message.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="background:#fafafa;padding:25px;">

<p style="margin:0;font-size:14px;color:#6b7280;">
© ${new Date().getFullYear()} Eventrix. All Rights Reserved.
</p>

<p style="margin-top:10px;font-size:12px;color:#9ca3af;">
Making event booking simple, secure, and memorable.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};