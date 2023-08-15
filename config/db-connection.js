'use strict';

const Sequelize = require('sequelize');
const config = {
  database: process.env.PLATFORM_DB_NAME,
  username: process.env.PLATFORM_USERNAME,
  password: process.env.PLATFORM_PASSWORD,
  host: process.env.PLATFORM_DB_HOST,
  dialect: process.env.PLATFORM_DB_DIALECT,
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;