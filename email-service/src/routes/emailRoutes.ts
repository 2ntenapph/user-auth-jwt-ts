import express from "express";
import { sendOtpEmail } from "../controllers/emailController";

const router = express.Router();

router.post("/send-otp", sendOtpEmail);

export default router;
