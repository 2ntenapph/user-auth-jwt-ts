import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!, // Ensure this is read correctly as a string
  {
    host: process.env.DB_HOST!,
    dialect: "postgres",
    port: Number(process.env.DB_PORT!),
    logging: console.log, // Enable logging to debug connection issues
  }
);

export default sequelize;
