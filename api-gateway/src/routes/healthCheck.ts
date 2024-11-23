import express, { Request, Response } from 'express';
import logger from '../utils/logger'; // Import the logger

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  // Log the incoming request
  logger.info(`Health check request received from ${req.ip}`);

  // Respond to the health check request
  res.status(200).json({ message: 'API Gateway is running' });

  // Log the successful response
  logger.info(`Health check response sent: ${JSON.stringify({ message: 'API Gateway is running' })}`);
});

export default router;
