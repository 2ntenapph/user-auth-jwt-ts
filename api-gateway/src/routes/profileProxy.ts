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
      // Log request metadata in a structured format
      logger.info("Proxy Request Sent", {
        service: "profile-proxy",
        method: req.method,
        originalUrl: req.url,
        targetUrl: config.authServiceUrl,
        headers: req.headers,
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response metadata
      logger.info("Proxy Response Received", {
        service: "profile-proxy",
        method: req.method,
        url: req.url,
        statusCode: proxyRes.statusCode,
        headers: proxyRes.headers,
      });
    },
    onError: (err, req, res) => {
      // Log errors with additional metadata
      logger.error("Proxy Error", {
        service: "profile-proxy",
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
      });
      res.status(502).json({ error: "Bad Gateway", message: err.message });
    },
  })
);

export default router;
