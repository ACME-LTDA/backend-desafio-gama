const express = require('express')
const cors = require('cors')
const { iniciaBanco } = require('./models/config-banco')
// const pilotosRouter = require('./routes/pilotos')
const usuariosRoutes = require('./routes/usuarios')

require('dotenv').config({path: __dirname + '/.env'})

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/usuarios', usuariosRoutes)

iniciaBanco()

const port = process.env.PORTA_APP || 3001;

console.log('Iniciando o servidor...')
app.listen(port, () => {
    console.log(`Servidor iniciado com sucesso na porta: ${port}`)
})
