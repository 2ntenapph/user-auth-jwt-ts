import jwt from "jsonwebtoken";
import { saveRefreshToken } from "../db/repositories/tokenRepository";

// Generate Access and Refresh Tokens
export const generateTokens = async (userId: number): Promise<{ accessToken: string; refreshToken: string }> => {
  // Generate Access Token
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" } // Expires in 15 minutes
  );

  // Generate Refresh Token
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" } // Expires in 7 days
  );

  // Save Refresh Token in the database
  await saveRefreshToken(userId, refreshToken);

  return { accessToken, refreshToken };
};
