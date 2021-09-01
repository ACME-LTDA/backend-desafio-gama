const express = require('express')
const { iniciaBanco } = require('./models/config-banco')

// const pilotosRouter = require('./routes/pilotos')
const usuariosRoutes = require('./routes/usuarios')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/usuarios', usuariosRoutes)

iniciaBanco()

const port = 3001;

console.log('Iniciando o servidor...')
app.listen(port, () => {
    console.log(`Servidor iniciado com sucesso na porta: ${port}`)
})
