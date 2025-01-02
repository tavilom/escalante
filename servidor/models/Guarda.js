const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guarda = sequelize.define('Guarda', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expediente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  turno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordenador: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  destaque: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Guarda;
