const { Usuario } = require('../models/usuarios')
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');

const rodadasSalt = 10

exports.criaUsuario = async (req, res, next) => {
    const saltSenha = await bcrypt.genSalt(rodadasSalt)
    const hashSenha = await bcrypt.hash(req.body.senha, saltSenha)
    Usuario.sync()
    let msgErro = null
    await Usuario.create({
        email: req.body.email,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        hashSenha: hashSenha,
        salt: saltSenha
    })
    .then(() => {
        console.log('Usuário criado com sucesso')
    })
    .catch(err => {
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

// exports.cliente_details = (req, res, next) => {
//     Cliente.findById(req.params.id, (err, cliente) => {
//         if (err) return next(new Error(`Ocorreu um erro: ${err}`));
//         res.send(cliente);
//     })
// }

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
