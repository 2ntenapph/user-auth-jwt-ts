import { Sequelize } from 'sequelize';

// SQLite database (stored as a file)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // Path to SQLite database file
});

export default sequelize;
