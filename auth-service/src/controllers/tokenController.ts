import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  findRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
  deleteAllUserTokens,
} from "../db/repositories/tokenRepository";
import { generateTokens } from "../utils/generateTokens";
import { clearCookie, setTokenCookie } from "../utils/setTokenCookie";
import User from "../db/models/userModel";
import { addToBlocklist, isInBlocklist } from "../redis/utils/redisAuth";
import { logInfo, logWarn, logError } from "../utils/loggerHelper";

// Validate Token
export const validateToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    logWarn("Token Validation Failed: No token provided");
    res.status(400).json({ message: "Token is required" });
    return;
  }

  try {
    // Decode the token without verifying to extract the `jti`
    const decoded = jwt.decode(token) as { jti?: string; exp?: number };

    // Check if the token is in the blocklist
    if (decoded?.jti && (await isInBlocklist(decoded.jti))) {
      logWarn("Token Validation Failed: Token revoked", { jti: decoded.jti });
      res.status(401).json({ message: "Token has been revoked" });
      return;
    }

    // Verify the token with the secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    logInfo("Token Validated Successfully", { user: verified });

    res.status(200).json({ user: verified }); // Return the decoded payload
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      logWarn("Token Validation Failed: Token expired");
      res.status(401).json({ message: "Token has expired" });
    } else {
      logError("Token Validation Failed", err);
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

// Refresh Tokens
export const refreshTokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.jwt; // Refresh token from cookies
    const authHeader = req.headers["authorization"]; // Optional access token from headers
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!refreshToken) {
      logWarn("Token Refresh Failed: No refresh token provided");
      res.status(401).json({ message: "Unauthorized: Refresh token not provided" });
      return;
    }

    // Validate the refresh token exists in the database
    const tokenRecord = await findRefreshToken(refreshToken);
    if (!tokenRecord) {
      logWarn("Token Refresh Failed: Invalid or expired refresh token");
      res.status(403).json({ message: "Invalid or expired refresh token" });
      return;
    }

    // Verify the refresh token
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: number;
    };

    // If access token is provided, add it to the blocklist
    if (accessToken) {
      const decoded = jwt.decode(accessToken) as { jti?: string; exp?: number } | null;
      if (decoded?.jti && decoded?.exp) {
        await addToBlocklist(decoded.jti, decoded.exp);
        logInfo("Access Token Blocklisted", { jti: decoded.jti });
      }
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(payload.userId);

    // Update the refresh token in the database
    await saveRefreshToken(payload.userId, newRefreshToken);
    await deleteRefreshToken(refreshToken);
    setTokenCookie(res, newRefreshToken);

    logInfo("Tokens Refreshed Successfully", { userId: payload.userId });

    // Return the new access token
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err: any) {
    logError("Token Refresh Failed", err);
    res.status(500).json({ message: "Error during token refresh", error: err.message });
  }
};

// Revoke All Tokens
export const revokeAllTokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      logWarn("Token Revocation Failed: No user ID provided");
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Fetch the user to check if they exist
    const user = await User.findByPk(userId);
    if (!user) {
      logWarn("Token Revocation Failed: User not found", { userId });
      res.status(404).json({ message: "User not found" });
      return;
    }

    //TODO: Consider tokenVersion approach (no user can sill have acces if has an active acces token)
    // Blocklist all active access tokens for the user by incrementing tokenVersion
    // Delete all refresh tokens for the user
    await deleteAllUserTokens(userId);
    clearCookie(res);

    logInfo("All Tokens Revoked Successfully", { userId });

    res.status(200).json({ message: "All tokens revoked successfully" });
  } catch (err: any) {
    logError("Token Revocation Failed", err, { userId: req.body.userId });
    res.status(500).json({ message: "Error revoking tokens", error: err.message });
  }
};
