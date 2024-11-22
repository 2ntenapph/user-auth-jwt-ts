import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from './models/user';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "antonphilippov27@gmail.com", // Your email address
    pass: "ovby rgiu lhvm ymuo", // Your email password
  },
});

// Function to generate OTP and send via email
export const sendOtp = async (email: string) => {
  const otp = crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
  const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  // Find the user and set OTP
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  user.otp = otp;
  user.otpExpiration = new Date(otpExpiration);
  await user.save();

  // Send OTP email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Email Verification',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw new Error('Error sending OTP');
    }
    console.log('OTP sent: ' + info.response);
  });
};
