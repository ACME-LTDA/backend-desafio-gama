const express = require('express');
const router = express.Router();

const pilotos_controller = require('../controllers/pilotos');
const { validaAccessToken } = require('../controllers/sessao');

router.get('/lista', validaAccessToken, pilotos_controller.listaPilotos);

module.exports = router;
