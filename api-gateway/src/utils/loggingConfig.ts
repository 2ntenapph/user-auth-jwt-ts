import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// JSON format for files and external systems
export const jsonFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.json()
);

// Console format for development
export const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return stack
      ? `${timestamp} [${level}]: ${message} - ${stack}${metaString}`
      : `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

// Transports
export const loggerTransports = [
  new transports.Console({
    format: env === 'production' ? jsonFormat : consoleFormat,
  }),
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: jsonFormat,
  }),
];

// Additional transports for exceptions and rejections
export const exceptionTransport = new transports.File({
  filename: 'logs/exceptions.log',
  format: jsonFormat,
});
export const rejectionTransport = new transports.File({
  filename: 'logs/rejections.log',
  format: jsonFormat,
});
