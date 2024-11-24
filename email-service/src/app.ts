import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { getOtp, redis } from "./utils/redisClient";
import { logInfo, logError, logWarn } from "./utils/loggerHelper"; // Logging helpers

const app = express();
app.use(bodyParser.json());

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test Redis Connectivity Route
app.get("/test-redis", async (req, res) => {
  try {
    await redis.set("test", "value", "EX", 10); // Set a test key with expiration
    const value = await redis.get("test"); // Retrieve the test key
    logInfo("Redis Test Successful", { value });
    res.status(200).json({ message: "Redis is working", value });
  } catch (error: any) {
    logError("Redis Connection Error", error);
    res.status(500).json({ message: "Error connecting to Redis", error: error.message });
  }
});

/**
 * Sends an email using Nodemailer with HTML content.
 * @param to - Recipient's email address.
 * @param subject - Subject of the email.
 * @param html - HTML content of the email.
 * @returns Promise<void>
 */
const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    logInfo("Email Sent Successfully", { to, subject, response: info.response });
  } catch (error: any) {
    logError(`Error Sending Email to ${to}`, error, { subject });
    throw error;
  }
};

// Generate HTML email template
const generateEmailTemplate = (otp: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">Your Verification Code</h2>
      <p style="font-size: 16px; color: #333; text-align: center;">
        Use the code below to verify your email address:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; color: #4CAF50; font-weight: bold; padding: 10px 20px; border: 1px dashed #4CAF50; border-radius: 5px;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #555; text-align: center;">
        This code is valid for 3 minutes. If you did not request this code, please ignore this email.
      </p>
      <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
        <p>Thank you for using our service.</p>
        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  `;
};

// Send OTP Route
app.post("/send-otp", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const otp = await getOtp(email);

    if (!otp) {
      logWarn("OTP Not Found or Expired", { email });
      res.status(404).json({ message: "OTP not found or expired" });
      return;
    }

    // Generate email content
    const subject = "Your Verification Code";
    const htmlContent = generateEmailTemplate(otp);

    // Send OTP Email
    await sendEmail(email, subject, htmlContent);
    logInfo("OTP Email Sent", { email });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error: any) {
    logError("Error Sending OTP Email", error, { email });
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
});

// Start Email Service
const PORT = 4001;
app.listen(PORT, () => {
  logInfo("Email Service Started", { port: PORT });
});
