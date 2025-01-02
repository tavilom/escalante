const sequelize = require('../config/database');
const Guarda = require('./Guarda');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    await sequelize.sync({ force: false }); // Define force: true para recriar tabelas ao iniciar
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
})();

module.exports = { Guarda };
