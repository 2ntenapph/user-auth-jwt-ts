import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isInBlocklist } from "../redis/utils/redisAuth";

interface JwtPayload {
  email: string;
  jti?: string; // Ensure jti is part of the payload
}

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
    // Verify with the access token secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if the token is in the blocklist
    if (decoded.jti) {
      const isBlocked = await isInBlocklist(decoded.jti);
      if (isBlocked) {
        res.status(401).json({ message: "Token revoked" });
        return;
      }
    }

    (req as any).user = decoded; // Attach decoded token to the request
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token has expired" });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};
