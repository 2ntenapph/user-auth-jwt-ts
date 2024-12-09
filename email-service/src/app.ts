import express from "express";
import bodyParser from "body-parser";
import emailRoutes from "./routes/emailRoutes";
import { logInfo } from "./utils/loggerHelper";

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/email", emailRoutes);

export default app;
