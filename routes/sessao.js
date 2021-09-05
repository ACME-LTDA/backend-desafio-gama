const express = require('express')
const router = express.Router();

const sessoes_controller = require('../controllers/sessao');


router.post('/login', sessoes_controller.logaUsuario);

router.post('/:id/refresh-token', sessoes_controller.renovaAccessToken);

module.exports = router;
