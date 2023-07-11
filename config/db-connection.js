'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;