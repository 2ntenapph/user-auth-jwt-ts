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


export const validateToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: "Token is required" });
    return;
  }

  try {
    // Decode the token without verifying to extract the `jti`
    const decoded = jwt.decode(token) as { jti?: string, exp?: number };

    // Check if the token is in the blocklist
    if (decoded?.jti && (await isInBlocklist(decoded.jti))) {
      res.status(401).json({ message: "Token has been revoked" });
      return;
    }

    // Verify the token with the secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET!);

    res.status(200).json({ user: verified }); // Return the decoded payload
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token has expired" });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};


export const refreshTokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.jwt; // Refresh token from cookies
    const authHeader = req.headers["authorization"]; // Optional access token from headers
    const accessToken = authHeader && authHeader.split(" ")[1];
    
    if (!refreshToken) {
      res.status(401).json({ message: "Anauthorized: Refresh token not provided" });
      return;
    }

    // Validate the refresh token exists in the database // TODO: USE PK
    const tokenRecord = await findRefreshToken(refreshToken);
    if (!tokenRecord) {
      res.status(403).json({ message: "Invalid or expired refresh token" });
      return;
    }

    // Verify the refresh token (this also checks expiration from the token's `exp` claim)
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };

    // If access token is provided, add it to the blocklist
    if (accessToken) {
      const decoded = jwt.decode(accessToken) as { jti?: string, exp?: number } | null;
      if (decoded?.jti && decoded?.exp) {
        await addToBlocklist(decoded.jti, decoded.exp); // Blocklist the current access token
      }
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(payload.userId);

    // Update the refresh token in the database (rotation)
    await saveRefreshToken(payload.userId, newRefreshToken);
    await deleteRefreshToken(refreshToken);

    // Set the new refresh token in the cookie
    setTokenCookie(res, newRefreshToken)

    // Return the new access token
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err: any) {
    console.error("Error during token refresh:", err.message);
    res.status(500).json({ message: "Error during token refresh" });
  }
};


export const revokeAllTokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Fetch the user to check if they exist
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Delete all refresh tokens for the user
    await deleteAllUserTokens(userId);

    //TODO: Consider tokenVersion approach (no user can sill have acces if has an active acces token)
    // // Blocklist all active access tokens for the user by incrementing `tokenVersion`
    // const tokenVersion = user.tokenVersion + 1; // Increment token version
    // user.tokenVersion = tokenVersion; // Update user's token version
    // await user.save();

    // Clear the refresh token cookie
    clearCookie(res);

    // Add all active access tokens (based on token version) to the blocklist
    // This effectively invalidates all existing access tokens by invalidating their `tokenVersion`
    res.status(200).json({ message: "All tokens revoked successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Error revoking tokens", error: err.message });
  }
};

