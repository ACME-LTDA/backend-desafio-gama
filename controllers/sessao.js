const { Usuario } = require('../models/usuarios')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function obtemSegredoJwt() {
  return process.env.SEGREDO || "SEGREDO07"
}

function geraJwt(id, isAdmin) {
  const segredo = obtemSegredoJwt()
  return jwt.sign({ id: id, admin: isAdmin }, segredo,
    { expiresIn: '1800s' })
}

exports.autenticaUsuario = async (req, res, next) => {
  const usuario = await Usuario.findOne({
    where: { email: req.body.email }
  })
  if (usuario == null) {
    res.status(401).json({
      code: 401,
      message: 'Email ou senha inválidos!'
    })
  } else {
    const senhaValida = await bcrypt.compare(
      req.body.senha,
      usuario.hashSenha)
    if (!senhaValida) {
      res.status(401).json({
        code: 401,
        message: 'Email ou senha inválidos!'
      })
    } else {
      const isAdmin = usuario.administrador == "T" ? true : false
      const token = geraJwt(usuario.id, isAdmin)
      res.status(200).json({
        code: 200,
        token: token,
        id: usuario.id,
        isAdmin: isAdmin
      })
    }
  }
}

async function verificaJwt(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return await res.status(401).json({
      code: 401,
      message: "Token não enviado"
    })
  }

  const segredo = obtemSegredoJwt()
  await jwt.verify(token, segredo, async (err, user) => {
    let refreshToken = false
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return await res.status(401).json({
          code: 401,
          message: "Token expirado"
        })
      }
      // TODO chama codigo para gerar novo access token

    } else if (err instanceof jwt.JsonWebTokenError) {
      return await res.status(401).json({
        code: 401,
        message: "Token inválido"
      })
    } else {
      res.locals.isAdmin = user.admin
      res.locals.id = user.id
    }
  })

  next()
}

module.exports.verificaJwt = verificaJwt
