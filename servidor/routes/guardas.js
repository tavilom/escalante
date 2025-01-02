const express = require('express');
const guardasController = require('../controllers/guardasController');
const router = express.Router();

router.get('/', guardasController.listar);
router.post('/', guardasController.criar);
router.put('/:id', guardasController.atualizar);
router.delete('/:id', guardasController.excluir);

module.exports = router;
