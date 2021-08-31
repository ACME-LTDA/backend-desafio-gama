const axios = require('axios')
const { DataTypes } = require('sequelize');

const { Construtor } = require('../models/construtores')

// const { salvaConstrutor } = require('./models/construtores')

async function obtemListaConstrutores() {
    let listaConstrutores = null
    await axios.get('http://ergast.com/api/f1/constructors.json?limit=1')
        .then(res => {
            total = res.data['MRData']['total']
            console.log(`Total de construtores: ${total}`)
        });
    await axios.get(`http://ergast.com/api/f1/constructors.json?limit=${total}`)
        .then(res => {
            listaConstrutores = res.data['MRData']['ConstructorTable']['Constructors']
        });
    return listaConstrutores
}

async function obtemUmConstrutor() {
    let construtor = null
    await axios.get('http://ergast.com/api/f1/constructors.json?limit=1')
        .then(res => {
            construtor = res.data['MRData']['ConstructorTable']['Constructors'][0]
        });
    console.log(construtor)

    return construtor
}

function construtorFormatadoModel(construtor) {
    return ({
        id: construtor.constructorId,
        urlWiki: construtor.url,
        nome: construtor.name,
        nacionalidade: construtor.nationality
    })
}

async function populaConstrutores() {
    await Construtor.sync()
    const totalConstrutores = await Construtor.count()
    if (totalConstrutores == 0) {
        const listaConstrutores = await obtemListaConstrutores()
        const listaParaModel = listaConstrutores.map(construtor => {
            return construtorFormatadoModel(construtor)
        })
        await Construtor.bulkCreate(listaParaModel)
        console.log(`Lista com ${listaParaModel.length} construtores salva no banco`)
    }
}

async function armazenaUmConstrutor() {
    // baixa o construtor
    const construtor = await obtemUmConstrutor()
    console.log(construtor)
    // armazena o construtor no banco de dados
    const construtorFormatado = construtorFormatadoModel(construtor)
    const construtorSalvo = await Construtor.create(construtorFormatado)
    console.log('Construtor salvo no banco:')
    console.log(construtorSalvo.toJSON())
}

module.exports = { populaConstrutores, armazenaUmConstrutor }
