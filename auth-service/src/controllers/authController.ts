import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../db/models/userModel";
import { storeOtp } from "../redis/utils/redisOtp";
import { addToBlocklist } from "../redis/utils/redisAuth";
import axios from "axios";
import { deleteRefreshToken } from "../db/repositories/tokenRepository";
import { generateTokens } from "../utils/generateTokens";
import { clearCookie, setTokenCookie } from "../utils/setTokenCookie";
import { logInfo, logWarn, logError } from "../utils/loggerHelper"; // Use logging helpers

// User Signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  try {
    logInfo("Signup Attempt", { email, role });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logWarn("Signup Failed: Email already in use", { email });
      res.status(400).json({ message: "Email is already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash: hashedPassword,
      role: role !== "user" ? role : "user",
      isVerified: false,
    });

    const otp = await storeOtp(email);
    logInfo("OTP Generated", { email });

    await axios.post("http://email-service:4001/send-otp", { email, otp });
    logInfo("Verification Email Sent", { email });

    res.status(201).json({ message: "User created. Verify your email." });
  } catch (err: any) {
    logError("Signup Error", err, { email });
    res.status(500).json({ message: "Error during signup", error: err.message });
  }
};

// User Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    logInfo("Login Attempt", { email });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      logWarn("Login Failed: User not found", { email });
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.isVerified) {
      logWarn("Login Failed: Email not verified", { email });
      res.status(403).json({ message: "Please verify your email first" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logWarn("Login Failed: Invalid password", { email });
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const { accessToken, refreshToken } = await generateTokens(user.id!);

    setTokenCookie(res, refreshToken);
    logInfo("Login Successful", { email, userId: user.id });

    res.status(200).json({ message: "Login successful", accessToken });
  } catch (err: any) {
    logError("Login Error", err, { email });
    res.status(500).json({ message: "Error during login", error: err.message });
  }
};

// User Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const refreshToken = req.cookies?.jwt;

    logInfo("Logout Attempt");

    let actionTaken = false;

    if (accessToken) {
      const decoded = jwt.decode(accessToken) as { jti?: string; exp?: number } | null;
      if (decoded?.jti && decoded?.exp) {
        await addToBlocklist(decoded.jti, decoded.exp);
        logInfo("Access Token Blocked", { jti: decoded.jti });
        actionTaken = true;
      }
    }

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
      clearCookie(res);
      logInfo("Refresh Token Revoked and Cookie Cleared");
      actionTaken = true;
    }

    if (!actionTaken) {
      logWarn("Logout Failed: No valid token provided");
      res.status(400).json({ message: "No valid token provided" });
      return;
    }

    logInfo("Logout Successful");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err: any) {
    logError("Logout Error", err);
    res.status(500).json({ message: "Error during logout", error: err.message });
  }
};
