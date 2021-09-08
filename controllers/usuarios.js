const { Usuario } = require('../models/usuarios')
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');
const { RefreshToken } = require('../models/sessao');

const { tokenCookieName, tokenCookiePath } = require('./sessao');

const rodadasSalt = 10

const criaAdmin = async () => {
  await Usuario.sync();
  const totalUsuarios = await Usuario.count();
  if (totalUsuarios == 0) {
    console.log('Criando o admin');
    const saltSenha = await bcrypt.genSalt(rodadasSalt);
    const hashSenha = await bcrypt.hash("12345", saltSenha);
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
      });
  }
}

const criaHashSenha = async (senha) => {
  let dadosHash = {
    saltSenha: null,
    hashSenha: null
  }

  dadosHash.saltSenha = await bcrypt.genSalt(rodadasSalt);
  dadosHash.hashSenha = await bcrypt.hash(senha, dadosHash.saltSenha);

  return dadosHash;
}

const criaUsuario = async (req, res) => {
  // checa se o token eh valido EEE se o usuario eh admin
  if (res.locals.isAdmin) {
    const { saltSenha, hashSenha } = await criaHashSenha(req.body.senha);
    Usuario.sync();
    let msgErro = null;
    await Usuario.create({
      email: req.body.email,
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      hashSenha: hashSenha,
      salt: saltSenha,
      administrador: "F"
    })
      .then(
        () => {
          console.log('Usuário criado com sucesso');
        },
        err => {
          console.log('Usuário não foi criado')
          if (err instanceof UniqueConstraintError)
            msgErro = 'Email já em uso'
        });

    if (msgErro === null) {
      res.status(200).json({
        status: 'success',
        data: null
      });
    } else {
      res.status(400).json({
        status: 'fail',
        data: { message: msgErro }
      });
    }
  }
}

const retornaUsuario = async (req, res) => {
  if (req.params.id == undefined)
    return await res.status(400).send();
  else {
    if (res.locals.id != req.params.id)
      return await res.status(403).send();

    const dadosUsuario = await Usuario.findByPk(req.params.id)
      .then(
        usuario => usuario.get(),
        err => null
      );

    if (dadosUsuario !== null)
      return await res.status(200).json({
        status: 'success',
        data: {
          dados: {
            email: dadosUsuario.email,
            nome: dadosUsuario.nome,
            sobrenome: dadosUsuario.sobrenome
          }
        }
      });
    else
      return await res.status(400).send();
  }
}

const removerUsuario = async (req, res) => {
  if (req.params.id == undefined)
    return await res.status(400).send();
  else {
    if (res.locals.id != req.params.id)
      return await res.status(403).send();

    await RefreshToken.destroy({
      where: { idUsuario: res.locals.id }
    });
    const usuario = await Usuario.findByPk(res.locals.id);
    await usuario.destroy();
    return await res
      .status(200)
      .clearCookie(tokenCookieName, { path: tokenCookiePath })
      .json({
        status: 'success',
        data: {
          message: 'Usuário removido com sucesso'
        }
      });
  }
}

const alteraUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id)
    .then(
      res => res,
      err => null
    );
  if (usuario === null)
    return await res.status(400).send();
  else {
    if (req.body.nome) usuario.nome = req.body.nome;
    if (req.body.sobrenome) usuario.sobrenome = req.body.sobrenome;
    if (req.body.senha) {
      const { saltSenha, hashSenha } = await criaHashSenha(req.body.senha);
      usuario.hashSenha = hashSenha;
      usuario.salt = saltSenha;
    }

    usuario.save();

    return await res.status(201)
      .json({
        status: 'success',
        data: null
      });
  }
}

module.exports = {
  criaAdmin,
  criaUsuario,
  retornaUsuario,
  removerUsuario,
  alteraUsuario
}
