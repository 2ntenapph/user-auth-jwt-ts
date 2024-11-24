import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Middleware to log incoming requests and responses
const logRequestsAndResponses = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    clientIp: req.ip,
    headers: sanitize(req.headers),
    body: sanitize(req.body),
  });

  res.on('finish', () => {
    const responseTimeMs = Date.now() - startTime;
    logger.info('Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTimeMs,
    });
  });

  next();
};

// Sanitize sensitive data
const sanitize = (data: any): object => {
  const sanitized = { ...data };
  if (sanitized.authorization) sanitized.authorization = '***';
  return sanitized;
};

export default logRequestsAndResponses;
