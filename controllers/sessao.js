const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')

const { Usuario } = require('../models/usuarios')
const { RefreshToken } = require('../models/sessao')

const obtemSegredo = () => process.env.SEGREDO || "SEGREDO07"

function geraAcessToken(id, isAdmin) {
  const segredo = obtemSegredo()
  return jwt.sign({ id: id, admin: isAdmin }, segredo,
    { expiresIn: '600s' })
}

async function geraRefreshToken(idUsuario) {
  const segredo = obtemSegredo()
  const uuid = uuidv4().toString()
  const dataExpiracao = dayjs().add(7, 'day').unix()
  const refreshTokenGerado = await jwt.sign({ uuid: uuid }, segredo,
    { expiresIn: dataExpiracao })
  if (refreshTokenGerado != null)
    await RefreshToken.create({
      id: uuid,
      dataExpiracao: dataExpiracao,
      idUsuario: idUsuario
    })
}

// const geraCookieRefreshToken  = (req, res, next) => {

// }

const logaUsuario = async (req, res, next) => {
  const usuario = await Usuario.findOne({
    where: { email: req.body.email }
  })
  if (usuario == null) {
    res.status(400).json({
      status: 'fail',
      message: 'Email ou senha inválidos!'
    })
  } else {
    const senhaValida = await bcrypt.compare(
      req.body.senha,
      usuario.hashSenha)
    if (!senhaValida) {
      res.status(401).json({
        status: 'fail',
        message: 'Email ou senha inválidos!'
      })
    } else {
      const isAdmin = usuario.administrador == "T" ? true : false
      const accessToken = geraAcessToken(usuario.id, isAdmin)
      const refreshToken = geraRefreshToken(usuario.id)
      dayjs.extend(duration)
      res.status(200)
        .cookie(
          'user_auth_cookie',
          { refreshToken: refreshToken },
          {
            path: '/login',
            maxAge: dayjs.duration(7, 'day').asMilliseconds(),
            signed: true,
            httpOnly: true
          })
        .json({
          status: 'success',
          data: {
            token: accessToken,
            id: usuario.id,
            isAdmin: isAdmin
          }
        })
    }
  }
}

const verificaJwt = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return await res.status(400).json({
      status: 'fail',
      data: {
        'access-token': 'Access token not send'
      }
    })
  }

  const segredo = obtemSegredo()
  await jwt.verify(token, segredo, async (err, user) => {
    let refreshToken = false
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return await res.status(401).json({
          status: 'fail',
          data: {
            'access-token': err.toString()
          }
        })
      }
      // TODO chama codigo para gerar novo access token

    } else if (err instanceof jwt.JsonWebTokenError) {
      return await res.status(400).json({
        status: 'fail',
        message: err.toString()
      })
    } else {
      res.locals.isAdmin = user.admin
      res.locals.id = user.id
    }
  })

  next()
}


module.exports = { obtemSegredo, verificaJwt, logaUsuario }
