import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  email: string;
  role: string;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
    (req as any).user = decoded; // Add decoded user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
