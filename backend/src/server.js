require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database');
    console.error(err.message);
    process.exit(1);
  }
};

startServer();
