const express = require('express');
const router = express.Router();

const pilotos_controller = require('../controllers/pilotos');
const { validaAccessToken } = require('../controllers/sessao');

router.get('/lista', validaAccessToken, pilotos_controller.listaPilotos);

router.get('/:id', validaAccessToken, pilotos_controller.dadosPiloto);

router.post('/cria', validaAccessToken, pilotos_controller.criaPiloto);

router.post('/:id/altera', validaAccessToken, pilotos_controller.alteraPiloto);

router.post('/:id/remove', validaAccessToken, pilotos_controller.removePiloto);

module.exports = router;
