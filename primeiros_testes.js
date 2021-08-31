const axios = require('axios')
const { QueryTypes } = require('sequelize')
const { sequelize, iniciaConexaoBanco } = require('./models/config_sequelize')
const { Piloto } = require('./models/pilotos')

// const testeAxios = async () => {
//     await axios.get('http://ergast.com/api/f1/drivers.json').then(res => {
//         // console.log(res.data['MRData']['DriverTable']['Drivers']);
//         console.log('Dentro da chamada:\n\n',
//         res.data['MRData']);
//     });

//     console.log('\nPós função');
// }

// const salvaEBusca = async () => {
//     // await arnoux.save()
//     // console.log('Salvamento feito com sucesso!')

//     const resultadoBusca1 = await Piloto.findAll({
//         // attributes: ['id', 'sobrenome', 'nacionalidade'],
//         where: {
//             sobrenome: 'Arnoux'
//         }
//     })
//     console.table(resultadoBusca1[0]['dataValues'])
//     const resultadoBusca2 = await sequelize.query(
//         "SELECT id, idBusca, sobrenome, nacionalidade FROM Pilotos WHERE PRIMEIRONOME = 'René'", { type: QueryTypes.SELECT })
//     console.log('Resultado da busca:')
//     console.log(resultadoBusca2)
// }

// const arnouxjs = {
//     driverId: 'arnoux',
//     url: 'http://en.wikipedia.org/wiki/Ren%C3%A9_Arnoux',
//     givenName: 'René',
//     familyName: 'Arnoux',
//     dateOfBirth: '1948-07-04',
//     nationality: 'French'
// }

// const nascimento = arnouxjs.dateOfBirth.split('-')
// nascimento.forEach(item => {
//     item = Number(item)
// })

// const arnoux = Piloto.build({
//     idBusca: arnouxjs.driverId,
//     urlWiki: arnouxjs.url,
//     primeiroNome: arnouxjs.givenName,
//     sobrenome: arnouxjs.familyName,
//     dataNascimento: new Date(nascimento[0], nascimento[1] - 1, nascimento[2]),
//     nacionalidade: arnouxjs.nationality
// })

// const arnoux = Piloto.create({
//     idBusca: arnouxjs.driverId,
//     urlWiki: arnouxjs.url,
//     primeiroNome: arnouxjs.givenName,
//     sobrenome: arnouxjs.familyName,
//     dataNascimento: new Date(nascimento[0], nascimento[1] - 1, nascimento[2]),
//     nacionalidade: arnouxjs.nationality
// })

// testeAxios()
// testeConnection()
// salvaEBusca()
iniciaConexaoBanco()
