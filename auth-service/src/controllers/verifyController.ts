import { Request, Response } from "express";
import User from "../db/models/userModel";
import { getOtp, deleteOtp } from "../redis/utils/redisOtp";

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const storedOtp = await getOtp(email);

    if (!storedOtp || storedOtp !== otp) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      user.isVerified = true;
      await user.save();
    }

    await deleteOtp(email);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Error verifying email", error: err.message });
  }
};
