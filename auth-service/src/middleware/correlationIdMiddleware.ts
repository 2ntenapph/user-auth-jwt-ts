import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.headers['x-correlation-id'] = correlationId;

  res.setHeader('x-correlation-id', correlationId);
  logger.defaultMeta = { correlationId }; // Add correlation ID to all logs

  next();
};

export default correlationIdMiddleware;
