import { createProxyMiddleware } from 'http-proxy-middleware';
import { Router } from 'express';
import config from '../utils/config';
import logger from '../utils/logger';

const router = Router();

router.use(
  '/',
  createProxyMiddleware({
    target: config.authServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      // Log request metadata in structured format
      logger.info('Proxy Request Sent', {
        method: req.method,
        originalUrl: req.url,
        targetUrl: config.authServiceUrl,
        headers: req.headers,
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response status and headers
      logger.info('Proxy Response Received', {
        statusCode: proxyRes.statusCode,
        headers: proxyRes.headers,
      });
    },
    onError: (err, req, res) => {
      // Log errors in structured format
      logger.error('Proxy Error', {
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
