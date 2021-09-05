const { iniciaConexaoBanco, sequelize } = require('./config_sequelize')
const { populaPilotos } = require('../controllers/pilotos')
const { populaConstrutores } = require('../controllers/construtores')
const { populaTemporadasPeriodo } = require('../controllers/temporadas')
const { populaCorridasPeriodo } = require('../controllers/corridas')
const { populaResultadosPeriodo } = require('../controllers/resultados')
const { criaAdmin } = require('../controllers/usuarios')
const { RefreshToken } = require('./sessao')

const ANOINICIO = 2019
const ANOFIM = 2020

async function iniciaBanco() {
  console.log('Iniciando conexao com o banco...')
  await iniciaConexaoBanco()
  console.log('Começando a popular o banco se necessário...');
  await populaPilotos()
  await populaConstrutores()
  await populaTemporadasPeriodo(ANOINICIO, ANOFIM)
  await populaCorridasPeriodo(ANOINICIO, ANOFIM)
  await populaResultadosPeriodo(ANOINICIO, ANOFIM)
  await RefreshToken.sync()
  await criaAdmin()
  console.log('\n\nBanco inicializado e populado com os dados da API')
}

module.exports = { iniciaBanco }
