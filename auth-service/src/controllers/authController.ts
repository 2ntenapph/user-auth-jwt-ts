import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../db/models/userModel";
import { storeOtp } from "../redis/utils/redisOtp";
import { addToBlocklist } from "../redis/utils/redisAuth";
import axios from "axios";
import {
  deleteRefreshToken,
} from "../db/repositories/tokenRepository";
import { generateTokens } from "../utils/generateTokens";
import { clearCookie, setTokenCookie } from "../utils/setTokenCookie";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
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

  try {
    const otp = await storeOtp(email);
    await axios.post("http://email-service:4001/send-otp", { email, otp });
    res.status(201).json({ message: "User created. Verify your email." });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};



export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: "Please verify your email first" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const { accessToken, refreshToken } = await generateTokens(user.id!);

    // Set the refresh token in an HTTP-only secure cookie
    setTokenCookie(res, refreshToken);

    res.status(200).json({ message: "Login successful", accessToken });
  } catch (err:any) {
    res.status(500).json({ message: "Error during login", error: err.message });
  }
};


export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const refreshToken = req.cookies?.jwt;

    let actionTaken = false; // Track whether any token operation occurred

    // Handle access token
    if (accessToken) {
      const decoded = jwt.decode(accessToken) as { jti?: string, exp?: number } | null;
      if (decoded?.jti && decoded?.exp) {
        await addToBlocklist(decoded.jti, decoded.exp); // Block the access token
        actionTaken = true;
      }
    }

    // Handle refresh token
    if (refreshToken) {
      await deleteRefreshToken(refreshToken); // Remove the refresh token from the database
      clearCookie(res); // Clear the cookie
      actionTaken = true;
    }

    if (!actionTaken) {
      res.status(400).json({ message: "No valid token provided" });
      return;
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Error during logout", error: err.message });
  }
};


