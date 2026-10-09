require('dotenv').config();

const { Sequelize } = require('sequelize');

const options = {
  dialect: 'postgres',
  logging: false
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, options)
  : new Sequelize(
      process.env.DB_NAME || 'securuium',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        ...options,
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 5432)
      }
    );

module.exports = sequelize;
