"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// SQLite database (stored as a file)
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Path to SQLite database file
});
exports.default = sequelize;
