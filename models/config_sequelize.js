const { Sequelize } = require('sequelize')
const argv = require('minimist')(process.argv.slice(2))

const nomeDB = argv['nomedb'] ?? 'desafio_f1'
const senhaDB = argv['senhadb'] ?? '12345'
const usuarioDB = argv['usuariodb'] ?? 'root'
const portaDB = argv['portaDB'] ?? '3306'

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
