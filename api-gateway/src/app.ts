import express from "express";
import healthCheckRouter from './routes/healthCheck';
import authProxyRouter from './routes/authProxy';
import emailProxyRouter from './routes/emailProxy';
import config from "./utils/config";

const app = express();

// Health Check Route
app.use('/', healthCheckRouter);

// Auth Proxy Route
app.use('/auth', authProxyRouter);

// Email Proxy Route
app.use('/email', emailProxyRouter);

app.listen(config.port, () => {
    console.log(`API Gateway running on port ${config.port}`);
  });


export default app;