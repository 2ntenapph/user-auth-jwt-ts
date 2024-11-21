"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("./models/user"));
// Setup Nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "antonphilippov27@gmail.com", // Your email address
        pass: "ovby rgiu lhvm ymuo", // Your email password
    },
});
// Function to generate OTP and send via email
const sendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = crypto_1.default.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    // Find the user and set OTP
    const user = yield user_1.default.findOne({ where: { email } });
    if (!user)
        throw new Error('User not found');
    user.otp = otp;
    user.otpExpiration = new Date(otpExpiration);
    yield user.save();
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
});
exports.sendOtp = sendOtp;
