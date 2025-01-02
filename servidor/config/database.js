const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('escalante_teste', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
