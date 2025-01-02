import { Router } from 'express';
import { adminCreate, adminLogin } from './controllers/adminController.js'; // Importe as funções do controller
import {
    buscarExpedientes,
    cadastrarExpedientes,
    atualizarExpediente,
    excluirExpediente,
} from './controllers/expedienteController.js';

import {
    funcionarioIndex,
    funcionarioCreate,
    getFuncionarios,
    updateFuncionario,
    funcionarioDelete
  } from './controllers/guardasController.js';

const router = Router();

// Rota para cadastrar um novo administrador
router.post('/admin/create', adminCreate);

// Rota para autenticação (login) do administrador
router.post('/admin/login', adminLogin);


// Rota para buscar todos os expedientes e seus dados associados
router.get('/expedientes', buscarExpedientes);

// Rota para cadastrar um novo expediente e seus turnos
router.post('/expedientes', cadastrarExpedientes);

// Rota para atualizar um expediente específico e seus turnos
router.put('/expedientes/:id', atualizarExpediente);

// Rota para excluir um expediente específico (somente administradores)
router.delete('/expedientes/:id', excluirExpediente);

// Rota para listar todos os funcionários
router.get('/funcionarios', funcionarioIndex);

// Rota para criar um novo funcionário (somente para administradores com permissão)
router.post('/funcionarios', funcionarioCreate);

// Rota para listar funcionários para "atuacao" e "setorial"
router.get('/funcionarios/list', getFuncionarios);

// Rota para atualizar um funcionário específico (somente para "setorial")
router.put('/funcionarios/:id', updateFuncionario);

// Rota para excluir um funcionário específico (somente administradores com permissão)
router.delete('/funcionarios/:id', funcionarioDelete);

export default router;
