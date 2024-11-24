import express from 'express';
import healthCheckRouter from './routes/healthCheck';
import authProxyRouter from './routes/authProxy';
import profileProxyRouter from './routes/profileProxy';
import emailProxyRouter from './routes/emailProxy';
import config from './utils/config';
import logger from './utils/logger';
import logRequests from './middleware/loggerMiddleware';
import corsMiddleware from './middleware/corsMiddleware';

const app = express();

// Apply CORS middleware
app.use(corsMiddleware);

// Middleware to log requests
app.use(logRequests);

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
  logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(config.port, () => {
  logger.info(`API Gateway running on port ${config.port} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
