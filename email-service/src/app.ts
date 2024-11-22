import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import { getOtp, redis } from './utils/redisClient';

//TODO: Add kafka for email queue

const app = express();
app.use(bodyParser.json());

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get('/test-redis', async (req, res) => {
  try {
    await redis.set('test', 'value', 'EX', 10); // Set a test key with expiration
    const value = await redis.get('test'); // Retrieve the test key
    res.status(200).json({ message: 'Redis is working', value });
  } catch (error: any) {
    res.status(500).json({ message: 'Error connecting to Redis', error: error.message });
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
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      },
      (err, info) => {
        if (err) {
          console.error(`Error sending email to ${to}:`, err);
          reject(err);
        } else {
          console.log(`Email sent to ${to}:`, info.response);
          resolve();
        }
      }
    );
  });
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
app.post('/send-otp', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const otp = await getOtp(email);

    if (!otp) {
      res.status(404).json({ message: 'OTP not found or expired' });
      return;
    }

    // Generate email content
    const subject = 'Your Verification Code';
    const htmlContent = generateEmailTemplate(otp);

    // Send OTP Email
    await sendEmail(email, subject, htmlContent);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error sending email', error: err.message });
  }
});

// Start Email Service
const PORT = 4001;
app.listen(PORT, () => console.log(`Email Service running on port ${PORT}`));
