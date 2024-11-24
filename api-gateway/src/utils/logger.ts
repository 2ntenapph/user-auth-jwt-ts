import { createLogger } from 'winston';
import { loggerTransports, exceptionTransport, rejectionTransport } from './loggingConfig';

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Create the logger instance
const logger = createLogger({
  level: env === 'production' ? 'info' : 'debug', // Higher verbosity in development
  transports: loggerTransports,
  exceptionHandlers: [exceptionTransport],
  rejectionHandlers: [rejectionTransport],
});

export default logger;
