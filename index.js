const express = require('express')
const { iniciaBanco } = require('./models/config-banco')

const pilotosRouter = require('./routes/pilotos')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

iniciaBanco()
