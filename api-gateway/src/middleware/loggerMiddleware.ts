import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Middleware to log incoming requests
const logRequests = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`, {
    headers: sanitize(req.headers),
    body: sanitize(req.body),
  });
  next();
};

// Function to sanitize sensitive data
const sanitize = (data: any): object => {
  const sanitized = { ...data };
  if (sanitized.authorization) sanitized.authorization = '***';
  return sanitized;
};

export default logRequests;
