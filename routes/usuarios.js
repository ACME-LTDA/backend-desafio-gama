const express = require('express')
const router = express.Router();

const usuarios_controller = require('../controllers/usuarios');


// router.post('/create', usuarios_controller.usuarios_create);
router.post('/create', usuarios_controller.criaUsuario)

router.get('/:id', usuarios_controller.retornaDadosUsuario);

router.delete('/:id/delete', usuarios_controller.removerUsuario);

// router.get('/test', usuarios_controller.test);


// router.post('/:id/update',usuarios_controller.usuarios_update);


module.exports = router;
