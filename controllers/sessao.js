const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')

const { Usuario } = require('../models/usuarios')
const { RefreshToken } = require('../models/sessao')
const cookieParser = require('cookie-parser')

const refreshTokenCookieName = 'user_auth_cookie'
const obtemSegredo = () => process.env.SEGREDO || "SEGREDO07"

function geraAcessToken(id, isAdmin) {
  const segredo = obtemSegredo()
  return jwt.sign({ id: id, admin: isAdmin }, segredo,
    { expiresIn: '600s' })
}

async function geraRefreshToken(idUsuario, isAdmin) {
  const segredo = obtemSegredo()
  const uuid = uuidv4().toString()
  const dataExpiracao = dayjs().add(7, 'day').unix()
  const refreshTokenGerado = await jwt.sign({
    uuid: uuid,
    id: idUsuario,
    isAdmin: isAdmin
  },
    segredo, { expiresIn: dataExpiracao })
  if (refreshTokenGerado != null)
    await RefreshToken.create({
      id: uuid,
      dataExpiracao: dataExpiracao,
      idUsuario: idUsuario
    })
  return refreshTokenGerado
}

const renovaAccessToken = async (req, res, next) => {
  const signedCookies = req.signedCookies
  if (signedCookies == null || signedCookies['user_auth_cookie'] == undefined)
    return res.status(400).json({
      status: 'fail',
      data: { message: 'No refresh token cookie' }
    })

  const cookieData = signedCookies['user_auth_cookie']
  const dadosToken = await jwt.verify(cookieData.refreshToken,
    obtemSegredo())

  const refreshTokenSalvo = await RefreshToken.findByPk(dadosToken.uuid)

  if (refreshTokenSalvo == null)
    return res.status(400).json({
      status: 'fail',
      data: { message: 'Invalid refresh token' }
    })

  if (dadosToken.id != req.params.id)
    return res.status(403).send()

  const newAccessToken = await geraAcessToken(dadosToken.id,
    dadosToken.isAdmin)

  return res.status(201).json({
    status: 'success',
    data: {
      token: newAccessToken,
      id: dadosToken.id,
      isAdmin: dadosToken.isAdmin
    }
  })
}

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
      const refreshToken = await geraRefreshToken(usuario.id, isAdmin)
      dayjs.extend(duration)
      res.status(201)
        .cookie(
          refreshTokenCookieName,
          { refreshToken: refreshToken },
          {
            path: '/sessao',
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

const validaAccessToken = async (req, res, next) => {
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
    } else if (err instanceof jwt.JsonWebTokenError) {
      return await res.status(400).json({
        status: 'fail',
        data: {
          'access-token': err.toString()
        }
      })
    } else {
      res.locals.isAdmin = user.admin
      res.locals.id = user.id
    }
  })

  next()
}


module.exports = { obtemSegredo, validaAccessToken, logaUsuario, renovaAccessToken }
