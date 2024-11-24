import { Request, Response, NextFunction } from "express";
import axios from "axios";
import config from "../utils/config";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Token required" });
    return;
  }

  try {
    // Forward the token to the Auth Service for verification
    const response = await axios.post(`${config.authServiceUrl}/tokens/validate-token`, {
      token,
    });

    // Attach the decoded payload to the request
    (req as any).user = response.data.user;
    next();
  } catch (err: any) {
    if (err.response?.status === 401) {
      res.status(401).json({ message: err.response.data.message || "Invalid token" });
    } else {
      res.status(500).json({ message: "Error validating token", error: err.message });
    }
  }
};
