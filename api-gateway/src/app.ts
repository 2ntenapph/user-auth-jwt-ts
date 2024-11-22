import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Proxy to Auth Service
app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:4000', changeOrigin: true }));

// Proxy to Email Service
app.use('/email', createProxyMiddleware({ target: 'http://email-service:4001', changeOrigin: true }));

// Start API Gateway
const PORT = 4002;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
