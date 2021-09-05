const express = require('express');
const { validaAccessToken } = require('../controllers/sessao');
const router = express.Router();

const usuarios_controller = require('../controllers/usuarios');


// router.post('/create', usuarios_controller.usuarios_create);
router.post('/create', validaAccessToken, usuarios_controller.criaUsuario)

router.get('/:id', validaAccessToken, usuarios_controller.retornaDadosUsuario);

router.delete('/:id/delete', validaAccessToken, usuarios_controller.removerUsuario);

// router.get('/test', usuarios_controller.test);


// router.post('/:id/update',usuarios_controller.usuarios_update);


module.exports = router;
