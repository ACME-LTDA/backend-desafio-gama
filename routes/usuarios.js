const express = require('express');
const router = express.Router();

const usuarios_controller = require('../controllers/usuarios');
const { validaAccessToken } = require('../controllers/sessao');


router.post('/create', validaAccessToken, usuarios_controller.criaUsuario);

router.get('/:id', validaAccessToken, usuarios_controller.retornaUsuario);

router.delete('/:id/delete', validaAccessToken, usuarios_controller.removerUsuario);

router.post('/:id/altera', validaAccessToken, usuarios_controller.alteraUsuario);

module.exports = router;
