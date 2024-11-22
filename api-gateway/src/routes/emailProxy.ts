import { createProxyMiddleware } from 'http-proxy-middleware';
import { Router } from 'express';
import config from '../utils/config';

const router = Router();

router.use(
    "/",
    createProxyMiddleware({
      target: config.authServiceUrl,
      changeOrigin: true,
      pathRewrite: {
          '^/email': '', // Strips '/email' from the path before forwarding
        },
        logLevel: 'debug',
    })
  );
  

  export default router;