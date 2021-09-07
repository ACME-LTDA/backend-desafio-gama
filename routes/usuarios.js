const express = require('express');
const router = express.Router();

const usuarios_controller = require('../controllers/usuarios');
const { validaAccessToken } = require('../controllers/sessao');


router.post('/create', validaAccessToken, usuarios_controller.criaUsuario)

router.get('/:id', validaAccessToken, usuarios_controller.retornaDadosUsuario);

router.delete('/:id/delete', validaAccessToken, usuarios_controller.removerUsuario);

module.exports = router;
