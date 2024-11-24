import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const logRequestsAndResponses = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    logger.info('Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTimeMs: durationMs,
    });
  });

  next();
};

export default logRequestsAndResponses;
