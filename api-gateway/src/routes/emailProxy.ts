import { createProxyMiddleware } from 'http-proxy-middleware';
import { Router } from 'express';
import config from '../utils/config';
import logger from '../utils/logger';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

// Use middleware to validate JWT
router.use(authenticateToken);

router.use(
  '/',
  createProxyMiddleware({
    target: config.emailServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/email': '' },
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      // Log request metadata in structured format
      logger.info('Proxy Request Sent', {
        service: 'email-proxy',
        method: req.method,
        originalUrl: req.url,
        targetUrl: config.emailServiceUrl,
        headers: req.headers,
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response details
      logger.info('Proxy Response Received', {
        service: 'email-proxy',
        method: req.method,
        url: req.url,
        statusCode: proxyRes.statusCode,
        headers: proxyRes.headers,
      });
    },
    onError: (err, req, res) => {
      // Log errors in structured format
      logger.error('Proxy Error', {
        service: 'email-proxy',
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
      });
      res.status(502).json({ error: 'Bad Gateway', message: err.message });
    },
  })
);

export default router;
