const { Usuario } = require('../models/usuarios')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function geraJwt(email, isAdmin) {
  const segredo = process.env.SEGREDO || "SEGREDO007"
  return jwt.sign({ email: email, admin: isAdmin }, segredo,
    { expiresIn: '180s' })
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
    } else {
      const isAdmin = usuario.administrador == "T" ? true : false
      const token = geraJwt(usuario.email, isAdmin)
      res.status(200).json({
        code: 200,
        token: token,
        isAdmin: isAdmin
      })
    }
  }
}
