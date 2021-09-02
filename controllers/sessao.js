const { Usuario } = require('../models/usuarios')
const bcrypt = require('bcrypt');

function geraJwt(usuario) {
  const segredo = process.env.SEGREDO || "SEGREDO007"

  return token
}

exports.autenticaUsuario = async (req, res, next) => {
  const usuario = await Usuario.findOne({
    where: { email: req.body.email }
  })
  if (usuario == null) {
    res.status(401).json({
      code: 404,
      message: 'Email não cadastrado'
    })
  } else {
    const senhaValida = await bcrypt.compare(
      req.body.senha,
      usuario.hashSenha)
    if (!senhaValida) {
      res.status(401).json({
        code: 404,
        message: 'Senha inválida'
      })
    } else if (usuario.administrador == "T") {
      res.status(200).json({
        code: 200,
        isAdmin: true,
      })
    }
  }
  // else if (usuario.to)
  // console.log('pausa')
}
