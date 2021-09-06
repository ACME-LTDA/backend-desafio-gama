const { Sequelize } = require('sequelize')
const argv = require('minimist')(process.argv.slice(2))

const nomeDB = process.env.NOME_DB || 'desafio_f1'
const senhaDB = process.env.SENHA_DB || '12345'
const usuarioDB = process.env.USUARIO_DB || 'root'
const portaDB = process.env.PORTA_DB || '3306'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: portaDB,
  database: nomeDB,
  username: usuarioDB,
  password: senhaDB
})

async function iniciaConexaoBanco() {
  await sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })
}

module.exports = { sequelize, iniciaConexaoBanco }
