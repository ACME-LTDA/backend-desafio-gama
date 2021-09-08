const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { iniciaBanco } = require('./models/config-banco')
const usuariosRoutes = require('./routes/usuarios')
const sessoesRoutes = require('./routes/sessao')
const { obtemSegredo } = require('./controllers/sessao')
const uploadRoutes = require('./routes/upload')

require('dotenv').config({ path: __dirname + '/.env' })

const app = express()

const cliente = process.env.CLIENT || 'http://localhost:3000'

app.use(cors({ credentials: true, origin: cliente }))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(obtemSegredo()))

app.use('/usuarios', usuariosRoutes)
app.use('/sessao', sessoesRoutes)
app.use('/uploads', uploadRoutes)

iniciaBanco()

const port = process.env.PORTA_APP || 3001;

console.log('Iniciando o servidor...')
app.listen(port, () => {
  console.log(`Servidor iniciado com sucesso na porta: ${port}`)
})
