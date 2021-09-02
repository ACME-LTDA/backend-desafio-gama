const express = require('express')
const router = express.Router();

const usuarios_controller = require('../controllers/usuarios');


// router.post('/create', usuarios_controller.usuarios_create);
router.post('/create', usuarios_controller.criaUsuario)

// router.get('/test', usuarios_controller.test);

// router.get('/:id', usuarios_controller.usuarios_details);

// router.post('/:id/update',usuarios_controller.usuarios_update);

// router.get('/:id/delete', usuarios_controller.usuarios_delete);

module.exports = router;
