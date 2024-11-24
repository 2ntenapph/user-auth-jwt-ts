import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Define default metadata
const defaultMeta = { serviceName: 'AuthService', environment: env };

// JSON format for structured logs
const jsonFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.json()
);

// Console format for development
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return stack
      ? `${timestamp} [${level}]: ${message} - ${stack}${metaString}`
      : `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

// Define transports
const loggerTransports = [
  // Console Transport
  new transports.Console({
    format: env === 'production' ? jsonFormat : consoleFormat,
  }),
  // Daily Rotate File for General Logs
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: jsonFormat,
    level: 'info', // Log info and above
  }),
  // Separate File for Errors
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: jsonFormat,
    level: 'error', // Log only errors
  }),
];

// Create logger instance
const logger = createLogger({
  level: env === 'production' ? 'info' : 'debug', // Log more in development
  defaultMeta, // Attach default metadata to all logs
  transports: loggerTransports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: jsonFormat,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: jsonFormat,
    }),
  ],
});

export default logger;
