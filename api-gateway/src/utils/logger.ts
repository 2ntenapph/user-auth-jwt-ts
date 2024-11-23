import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Log format configuration
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level}]: ${message} - ${stack}` // Include stack trace for errors
      : `${timestamp} [${level}]: ${message}`;
  })
);

// Transports configuration based on environment
const loggerTransports = [
  new transports.Console({
    format: env === 'production'
      ? logFormat // Simple format for production (no colorization)
      : format.combine(format.colorize(), logFormat), // Colorized logs for development
  }),
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m', // Rotate when file exceeds 20MB
    maxFiles: '14d', // Keep logs for 14 days
  }),
];

// Logger instance
const logger = createLogger({
  level: env === 'production' ? 'info' : 'debug', // Info in production, debug in dev/test
  format: logFormat,
  transports: loggerTransports,
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }), // Log uncaught exceptions
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' }), // Log unhandled promise rejections
  ],
});

export default logger;
