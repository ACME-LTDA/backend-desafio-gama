const { Usuario } = require('../models/usuarios')
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');
const { RefreshToken } = require('../models/sessao');

const { tokenCookieName, tokenCookiePath } = require('./sessao');

const rodadasSalt = 10

exports.criaAdmin = async () => {
  await Usuario.sync()
  const totalUsuarios = await Usuario.count()
  if (totalUsuarios == 0) {
    console.log('Criando o admin')
    const saltSenha = await bcrypt.genSalt(rodadasSalt)
    const hashSenha = await bcrypt.hash("12345", saltSenha)
    await Usuario.create({
      email: "admin@admin.com",
      nome: "Admin",
      sobrenome: "System",
      hashSenha: hashSenha,
      salt: saltSenha,
      administrador: "T"
    })
      .then(() => {
        console.log('Admin criado com sucesso')
      })
  }
}

exports.criaUsuario = async (req, res, next) => {
  // checa se o token eh valido EEE se o usuario eh admin
  if (res.locals.isAdmin) {
    const saltSenha = await bcrypt.genSalt(rodadasSalt)
    const hashSenha = await bcrypt.hash(req.body.senha, saltSenha)
    Usuario.sync()
    let msgErro = null
    await Usuario.create({
      email: req.body.email,
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      hashSenha: hashSenha,
      salt: saltSenha,
      administrador: "F"
    })
      .then(() => {
        console.log('Usuário criado com sucesso')
      })
      .catch(err => {
        console.log('Usuário não foi criado')
        if (err instanceof UniqueConstraintError)
          msgErro = 'Email já em uso!'
      })

    if (msgErro == null) {
      res.status(200).json({
        code: 200,
        message: 'Usuário cadastrado com sucesso'
      })
    } else {
      res.status(400).json({
        code: 400,
        message: msgErro
      })
    }
  }
}

exports.retornaDadosUsuario = async (req, res, next) => {
  if (req.params.id == undefined)
    return res.status(400).send()
  else {
    if (res.locals.id != req.params.id)
      return res.status(403).send()

    const dadosUsuario = await Usuario.findByPk(req.params.id)
      .then(usuario => usuario.get())

    return res.status(200).json({
      code: 200,
      dados: {
        email: dadosUsuario.email,
        nome: dadosUsuario.nome,
        sobrenome: dadosUsuario.sobrenome
      }
    })
  }
}

exports.removerUsuario = async (req, res, next) => {
  if (req.params.id == undefined)
    return res.status(400).send()
  else {
    if (res.locals.id != req.params.id)
      return res.status(403).send()

    await RefreshToken.destroy({
      where: { idUsuario: res.locals.id }
    })
    res
    const usuario = await Usuario.findByPk(res.locals.id)
    await usuario.destroy()
    return res
      .status(200)
      .clearCookie(tokenCookieName, { path: tokenCookiePath })
      .json({
        code: 200,
        message: 'Usuário removido com sucesso'
      })
  }
}


// exports.cliente_update = (req, res, next) => {
//     Cliente.findByIdAndUpdate(req.params.id, {$set: req.body}, (err) => {
//         if (err) return
//             next(new Error(`Ocorreu um erro: ${err}`));
//         res.send('Cliente alterado!')
//     })
// }

// exports.cliente_delete = (req, res, next) => {
//     Cliente.findByIdAndRemove(req.params.id, (err => {
//         if(err) return
//             next(new Error(`Ocorreu um erro: ${err}`));
//         res.send('Cliente excluído!')
//     }))
// }
