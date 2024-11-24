import { Sequelize } from "sequelize";
import { logInfo, logWarn, logError } from "../utils/loggerHelper";

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!, // Ensure this is read correctly as a string
  {
    host: process.env.DB_HOST!,
    dialect: "postgres",
    port: Number(process.env.DB_PORT!),
    logging: (msg) => logInfo("Sequelize Query", { query: msg }), // Log all queries using the logger
  }
);

// Function to initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logInfo("Database Connection Established", {
      host: process.env.DB_HOST!,
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
    });
  } catch (err: any) {
    logError("Database Connection Failed", err, {
      host: process.env.DB_HOST!,
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
    });
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Function to sync database schema
export const syncDatabase = async (): Promise<void> => {
  try {
    await sequelize.sync({ alter: true }); // Use `{ alter: true }` to adjust schema
    logInfo("Database Schema Synchronized", { database: process.env.DB_NAME! });
  } catch (err: any) {
    logError("Database Schema Synchronization Failed", err, {
      database: process.env.DB_NAME!,
    });
    process.exit(1); // Exit the process if schema synchronization fails
  }
};

export default sequelize;
