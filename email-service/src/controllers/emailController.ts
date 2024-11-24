import { Request, Response } from "express";
import { generateOtpEmailTemplate } from "../templates/emailTemplates";
import { sendEmail } from "../services/emailService";
import { getOtp } from "../utils/redisClient";
import { logInfo, logWarn, logError } from "../utils/loggerHelper";

export const sendOtpEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const otp = await getOtp(email);

    if (!otp) {
      logWarn("OTP Not Found or Expired", { email });
      res.status(404).json({ message: "OTP not found or expired" });
      return;
    }

    const subject = "Your Verification Code";
    const htmlContent = generateOtpEmailTemplate(otp);

    await sendEmail(email, subject, htmlContent);
    logInfo("OTP Email Sent", { email });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error: any) {
    logError("Error Sending OTP Email", error, { email });
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};
