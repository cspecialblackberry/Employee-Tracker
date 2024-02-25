const Sequelize = require('sequelize');
require('dotenv').config();

//new sequelize instance to connect to db
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'mariadb',
    port: 3306,
    logging: false
  }
);

module.exports = sequelize;