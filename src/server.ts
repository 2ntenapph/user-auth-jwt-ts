import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import User from './models/user';
import sequelize from './models/db';
import { sendOtp } from './sendOtp';
import { verifyToken } from './middleware/auth';

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Sync the database
sequelize.sync();

// Route to handle user sign-up
app.post('/api/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400).json({ message: 'Email is already in use' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
    role,
    isVerified: false,  // Default to false
  });

  await sendOtp(email);

  res.status(201).json({ message: 'User created successfully. Please verify your email.' });
});

// Route for OTP email verification
app.post('/api/verify-email', async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (user.otp !== otp || Date.now() > (user.otpExpiration?.getTime() ?? 0)) {
    res.status(400).json({ message: 'Invalid or expired OTP' });
    return;
  }

  user.isVerified = true;
  user.role = 'verified_user';
  user.otp = null;
  user.otpExpiration = null;
  await user.save();

  const token = jwt.sign({ email: user.email, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '1h' });

  res.status(200).json({ message: 'Email verified successfully', token });
});

// Route for login
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (!user.isVerified) {
    res.status(403).json({ message: 'Please verify your email first' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const token = jwt.sign({ email: user.email, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token });
});

// Protected route to get user info
app.get('/api/user-info', verifyToken, async (req: Request, res: Response): Promise<void> => {
    // Access the user email from the JWT token stored in req.user
    const email = (req as any).user.email;
  
    // Fetch the user from the database using the email
    const user = await User.findOne({ where: { email } });
  
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
  
    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify your email first' });
      return;
    }
  
    // Respond with the user information if everything is valid
    res.status(200).json({
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });
  });
  

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
