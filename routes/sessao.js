const express = require('express')
const router = express.Router();

const sessoes_controller = require('../controllers/sessao');


router.post('/login', sessoes_controller.logaUsuario);

router.post('/refresh-token', sessoes_controller.validaRefreshToken,
  sessoes_controller.renovaAccessToken);

router.post('/logout', sessoes_controller.validaRefreshToken,
  sessoes_controller.deslogaUsuario);

module.exports = router;
