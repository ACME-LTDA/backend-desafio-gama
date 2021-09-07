const axios = require('axios')

const { Piloto } = require('../models/pilotos')

// const { salvaPiloto } = require('./models/pilotos')

async function obtemListaPilotos() {
  let listaPilotos = null
  let total = 0
  await axios.get('http://ergast.com/api/f1/drivers.json?limit=1')
    .then(res => {
      total = res.data['MRData']['total']
      console.log(`Total de pilotos: ${total}`)
    });
  await axios.get(`http://ergast.com/api/f1/drivers.json?limit=${total}`)
    .then(res => {
      listaPilotos = res.data['MRData']['DriverTable']['Drivers']
    });
  return listaPilotos
}

async function obtemUmPiloto() {
  let piloto = null
  await axios.get('http://ergast.com/api/f1/drivers.json?limit=1')
    .then(res => {
      piloto = res.data['MRData']['DriverTable']['Drivers'][0]
    });
  console.log(piloto)

  return piloto
}

function pilotoFormatadoModel(piloto) {
  return ({
    id: piloto.driverId,
    urlWiki: piloto.url,
    primeiroNome: piloto.givenName,
    sobrenome: piloto.familyName,
    dataNascimento: new Date(piloto.dateOfBirth).toISOString(),
    nacionalidade: piloto.nationality
  })
}

async function populaPilotos() {
  await Piloto.sync()
  const totalPilotos = await Piloto.count()
  if (totalPilotos == 0) {
    const listaPilotos = await obtemListaPilotos()
    const listaParaModel = listaPilotos.map(piloto => {
      return pilotoFormatadoModel(piloto)
    })
    await Piloto.bulkCreate(listaParaModel)
    console.log(`Lista com ${listaParaModel.length} pilotos salva no banco`)
  }
}

async function armazenaUmPiloto() {
  const piloto = await obtemUmPiloto()
  console.log(piloto)
  const pilotoFormatado = pilotoFormatadoModel(piloto)
  const pilotoSalvo = await Piloto.create(pilotoFormatado)
  console.log('Piloto salvo no banco:')
  console.log(pilotoSalvo.toJSON())
}

const listaPilotos = async (req, res, next) => {
  const pilotos = await Piloto.findAll({
    attributes: ['id', 'nomeCompleto']
  })

  return await res
    .status(200)
    .json({
      status: 'success',
      data: {
        pilotos: pilotos
      }
    })
}

module.exports = { populaPilotos, armazenaUmPiloto, listaPilotos }
