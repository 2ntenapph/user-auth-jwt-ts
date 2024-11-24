import jwt from "jsonwebtoken";
import { saveRefreshToken } from "../db/repositories/tokenRepository";
import { logInfo, logError } from "../utils/loggerHelper";

// Generate Access and Refresh Tokens
export const generateTokens = async (
  userId: number
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    // Generate Access Token
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" } // Expires in 15 minutes
    );
    logInfo("Access Token Generated", { userId });

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" } // Expires in 7 days
    );
    logInfo("Refresh Token Generated", { userId });

    // Save Refresh Token in the database
    await saveRefreshToken(userId, refreshToken);
    logInfo("Refresh Token Saved", { userId });

    return { accessToken, refreshToken };
  } catch (err: any) {
    logError("Error Generating Tokens", err, { userId });
    throw err; // Re-throw the error to allow the caller to handle it
  }
};
