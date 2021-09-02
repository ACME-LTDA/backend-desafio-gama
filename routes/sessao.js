const express = require('express')
const router = express.Router();

const sessoes_controller = require('../controllers/sessao');


router.post('/login', sessoes_controller.autenticaUsuario);

module.exports = router;
