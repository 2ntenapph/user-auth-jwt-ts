import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticateToken } from "../middleware/authenticateToken";
import config from "../utils/config";
import logger from "../utils/logger";

const router = Router();

// Use middleware to validate JWT
router.use(authenticateToken);

// Proxy to the User Profile Service
router.use(
  "/",
  createProxyMiddleware({
    target: config.authServiceUrl, // Target service
    changeOrigin: true,
    pathRewrite: { "^/profile": "" }, // Remove "/profile" from the path
    logLevel: "debug",
    onProxyReq: (proxyReq, req) => {
      logger.info(
        `Proxying request: ${req.method} ${req.url} -> ${config.authServiceUrl}`
      );
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error: ${err.message}`, { stack: err.stack });
      res.status(502).json({ error: "Bad Gateway", message: err.message });
    },
  })
);

export default router;
