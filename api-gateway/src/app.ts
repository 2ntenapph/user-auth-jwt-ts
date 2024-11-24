import express from 'express';
import healthCheckRouter from './routes/healthCheck';
import authProxyRouter from './routes/authProxy';
import profileProxyRouter from './routes/profileProxy';
import emailProxyRouter from './routes/emailProxy';
import config from './utils/config';
import logger from './utils/logger';
import logRequestsAndResponses from './middleware/loggerMiddleware';
import corsMiddleware from './middleware/corsMiddleware';
import cookieParser from 'cookie-parser';

const app = express();

// Apply CORS middleware
app.use(corsMiddleware);

// Parse cookies
app.use(cookieParser());

// Log incoming requests and responses
app.use(logRequestsAndResponses);

// Health Check Route
app.use('/', healthCheckRouter);

// Auth Proxy Route
app.use('/auth', authProxyRouter);

// Email Proxy Route
app.use('/email', emailProxyRouter);

// Profile Proxy Route
app.use('/profile', profileProxyRouter);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Error Middleware', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start the server
app.listen(config.port, () => {
  logger.info('API Gateway Started', {
    port: config.port,
    environment: process.env.NODE_ENV || 'development',
  });
});

export default app;
