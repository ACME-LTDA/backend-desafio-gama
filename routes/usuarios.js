const express = require('express');
const { verificaJwt } = require('../controllers/sessao');
const router = express.Router();

const usuarios_controller = require('../controllers/usuarios');


// router.post('/create', usuarios_controller.usuarios_create);
router.post('/create', verificaJwt, usuarios_controller.criaUsuario)

router.get('/:id', verificaJwt, usuarios_controller.retornaDadosUsuario);

router.delete('/:id/delete', verificaJwt, usuarios_controller.removerUsuario);

// router.get('/test', usuarios_controller.test);


// router.post('/:id/update',usuarios_controller.usuarios_update);


module.exports = router;
