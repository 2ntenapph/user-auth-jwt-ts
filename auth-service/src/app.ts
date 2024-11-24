import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sequelize from "./db";
import authRoutes from "./routes/authRoutes";
import verifyRoutes from "./routes/verifyRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

// Initialize Routes
app.use("/", authRoutes);
app.use("/verify", verifyRoutes);
app.use("/tokens", tokenRoutes);



// Sync Database
sequelize
  .sync({ alter: true }) // Safely alter schema
  .then(() => console.log('Database synchronized.'))
  .catch((err) => {
    console.error('Error synchronizing the database:', err.message);
    process.exit(1); // Exit if sync fails
  });


// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
