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
    pathRewrite: (path, req) => {
      // Log the incoming path
      logger.debug(`Incoming path: ${path}`);
      // Rewrite the path
      return path.replace(/^\/auth/, '');
    },
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      logger.info(`Proxying request: ${req.method} ${req.url} -> ${config.authServiceUrl}`);
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error: ${err.message}`, { stack: err.stack });
      res.status(502).json({ error: 'Bad Gateway', message: err.message });
    },
  })
);

export default router;
