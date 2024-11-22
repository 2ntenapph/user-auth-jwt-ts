import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "./db/db";
import User from "./models/user";
import { deleteOtp, getOtp, storeOtp } from "./utils/redisClient"
import axios from "axios"; // To call Email Service

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Sync Database
sequelize.sync();

// Signup Route
app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400).json({ message: "Email is already in use" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    isVerified: false,
  });

  // Call Email Service
  try {
    const otp = await storeOtp(email);

    await axios.post("http://email-service:4001/send-otp", { email, otp });
    res.status(201).json({ message: "User created. Verify your email." });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Login Route
app.post("/login", async (req: Request, res: Response): Promise<void> => {
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

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login successful", token });
});

// Verify Email
app.post(
  "/verify-email",
  async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    try {
      const storedOtp = await getOtp(email); // Retrieve the OTP from Redis

      if (!storedOtp) {
        res.status(400).json({ message: "OTP has expired or is invalid" });
        return;
      }

      if (storedOtp !== otp) {
        console.log(storedOtp, " ", otp);
        
        res.status(400).json({ message: "Incorrect OTP" });
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (user) {
        user.isVerified = true;
        user.otp = null;
        user.otpExpiration = null;
        await user.save();
      }

      // Delete the OTP from Redis after successful verification
      await deleteOtp(email);

      res.status(200).json({ message: "Email verified successfully" });
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error verifying OTP", error: err.message });
    }
  }
);

// Start Auth Service
const PORT = 4000;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
