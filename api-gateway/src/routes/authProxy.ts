import { createProxyMiddleware } from 'http-proxy-middleware';
import { Router } from 'express';
import config from '../utils/config';

const router = Router();

router.use('/', createProxyMiddleware({
  target: config.authServiceUrl,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
  logLevel: 'debug', // Log proxy details
}));

export default router;
