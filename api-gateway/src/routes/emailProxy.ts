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
      logger.info(`Proxying request: ${req.method} ${req.url} -> ${config.emailServiceUrl}`);
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error: ${err.message}`, { stack: err.stack });
      res.status(502).json({ error: 'Bad Gateway', message: err.message });
    },
  })
);

export default router;
