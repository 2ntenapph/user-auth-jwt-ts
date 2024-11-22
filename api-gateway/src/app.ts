import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Gateway is running' });
  });

// Proxy to Auth Service
app.use('/auth', createProxyMiddleware({
    target: 'http://auth-service:4000', // Docker service name
    changeOrigin: true,
    pathRewrite: {
      '^/auth': '', // Strips '/auth' from the path before forwarding
    },
  }));

// Proxy to Email Service
app.use(
  "/email",
  createProxyMiddleware({
    target: "http://email-service:4001",
    changeOrigin: true,
    pathRewrite: {
        '^/email': '', // Strips '/auth' from the path before forwarding
      },
  })
);

// Start API Gateway
const PORT = 4002;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
