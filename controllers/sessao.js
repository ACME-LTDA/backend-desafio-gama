const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')

const { Usuario } = require('../models/usuarios')
const { RefreshToken } = require('../models/sessao')

const tokenCookieName = 'user_auth_cookie'
const tokenCookiePath = '/sessao'
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
  const newAccessToken = await geraAcessToken(res.locals.dadosToken.id,
    res.locals.dadosToken.isAdmin)

  return res.status(201).json({
    status: 'success',
    data: {
      token: newAccessToken,
      id: res.locals.dadosToken.id,
      isAdmin: res.locals.dadosToken.isAdmin
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
      const accessToken = await geraAcessToken(usuario.id, isAdmin)
      const refreshToken = await geraRefreshToken(usuario.id, isAdmin)
      dayjs.extend(duration)
      res.status(201)
        .cookie(
          tokenCookieName,
          { refreshToken: refreshToken },
          {
            path: tokenCookiePath,
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

const deslogaUsuario = async (req, res, next) => {
  await res.locals.refreshTokenSalvo.destroy()
  return res
    .status(200)
    .clearCookie(tokenCookieName, { path: tokenCookiePath })
    .json({
      status: 'success',
      data: {
        message: 'Logout efetivado com sucesso'
      }
    })
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


const validaRefreshToken = async (req, res, next) => {
  const signedCookies = req.signedCookies
  if (signedCookies == null || signedCookies[tokenCookieName] == undefined)
    return res.status(400).json({
      status: 'fail',
      data: { message: 'No refresh token cookie' }
    })

  const cookieData = signedCookies[tokenCookieName]
  const dadosToken = await jwt.verify(cookieData.refreshToken,
    obtemSegredo())

  const refreshTokenSalvo = await RefreshToken.findByPk(dadosToken.uuid)

  if (refreshTokenSalvo === null)
    return res.status(400)
      .clearCookie(tokenCookieName, { path: tokenCookiePath })
      .json({
        status: 'fail',
        data: { message: 'Invalid refresh token' }
      })

  const dataExpiracao = dayjs(refreshTokenSalvo.dataExpiracao)
  const diferenca = dataExpiracao.diff(dayjs().unix())

  if (diferenca <= 0)
    return res.status(400)
      .clearCookie(tokenCookieName, { path: tokenCookiePath })
      .json({
      status: 'fail',
      data: { message: 'Invalid refresh token' }
    })

  res.locals.dadosToken = dadosToken
  res.locals.refreshTokenSalvo = refreshTokenSalvo
  next()
}


module.exports = {
  obtemSegredo,
  validaAccessToken,
  validaRefreshToken,
  logaUsuario,
  deslogaUsuario,
  renovaAccessToken,
  tokenCookieName,
  tokenCookiePath
}
