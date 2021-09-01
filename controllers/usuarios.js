const { Usuario } = require('../models/usuarios')
const bcrypt = require('bcrypt');

const rodadasSalt = 10

exports.criaUsuario = async (req, res, next) => {
    const saltSenha = await bcrypt.genSalt(rodadasSalt)
    const hashSenha = await bcrypt.hash(req.body.senha, saltSenha)
    console.log(hashSenha)
    console.log(saltSenha)
    Usuario.sync()
    Usuario.create({
        email: req.body.email,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        hashSenha: hashSenha,
        salt: saltSenha
    })
    .then(() => {
        console.log('Criando o usuário')
    })
    .catch(err => {
        console.log('Erro ao criar o usuário: ', err)
    })
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
