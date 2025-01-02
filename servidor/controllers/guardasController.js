const { Guarda } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const guardas = await Guarda.findAll();
      res.json(guardas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar guardas.' });
    }
  },

  async criar(req, res) {
    try {
      const guarda = await Guarda.create(req.body);
      res.status(201).json(guarda);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar guarda.' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      await Guarda.update(req.body, { where: { id } });
      res.json({ message: 'Guarda atualizado com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar guarda.' });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;
      await Guarda.destroy({ where: { id } });
      res.json({ message: 'Guarda excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir guarda.' });
    }
  },
};
