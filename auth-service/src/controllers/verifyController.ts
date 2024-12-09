import { Request, Response } from "express";
import User from "../db/models/userModel";
import { getOtp, deleteOtp } from "../redis/utils/redisOtp";
import { logInfo, logWarn, logError } from "../utils/loggerHelper";

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  logInfo("Email Verification Attempt", { email });

  try {
    const storedOtp = await getOtp(email);

    if (!storedOtp) {
      logWarn("Email Verification Failed: OTP not found or expired", { email });
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    if (storedOtp !== otp) {
      logWarn("Email Verification Failed: Incorrect OTP", { email, otp });
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      user.isVerified = true;
      await user.save();
      logInfo("User Verified Successfully", { email });
    }

    await deleteOtp(email);
    logInfo("OTP Deleted After Verification", { email });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err: any) {
    logError("Error Verifying Email", err, { email });
    res.status(500).json({ message: "Error verifying email", error: err.message });
  }
};
