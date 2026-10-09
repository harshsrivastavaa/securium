require('dotenv').config();

const buildConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      logging: false
    };
  }

  return {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'securuium',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false
  };
};

module.exports = {
  development: buildConfig(),
  test: buildConfig(),
  production: buildConfig()
};
