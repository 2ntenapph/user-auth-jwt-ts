import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sequelize from "./db";
import authRoutes from "./routes/authRoutes";
import verifyRoutes from "./routes/verifyRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import cookieParser from "cookie-parser";
import logRequestsAndResponses from "./middleware/loggerMiddleware";
import correlationIdMiddleware from "./middleware/correlationIdMiddleware";
import { logInfo, logError } from "./utils/loggerHelper"; // Import logging helpers

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

// Middleware
app.use(logRequestsAndResponses); // Log incoming requests and responses
app.use(correlationIdMiddleware); // Add correlation ID for tracing

// Routes
app.use("/", authRoutes);
app.use("/verify", verifyRoutes);
app.use("/tokens", tokenRoutes);

// Sync Database
(async () => {
  try {
    await sequelize.sync({ alter: true }); // Safely alter schema
    logInfo("Database Synchronized Successfully", { alter: true });
  } catch (err: any) {
    logError("Error Synchronizing Database", err);
    process.exit(1); // Exit the process if database sync fails
  }
})();

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logInfo("Auth Service Running", { port: PORT });
});
