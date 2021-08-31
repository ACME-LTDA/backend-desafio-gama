const { Sequelize } = require('sequelize');
const { sequelize } = require('./config_sequelize')

// "constructorId": "adams",
// "url": "http:\/\/en.wikipedia.org\/wiki\/Adams_(constructor)",
// "name": "Adams",
// "nationality": "American"

const Construtor = sequelize.define('Construtor', {
    id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    urlWiki: {
        type: Sequelize.STRING(200)
    },
    nome: {
        type: Sequelize.STRING(100)
    },
    nacionalidade: {
        type: Sequelize.STRING(30)
    }
}, {
    tableName: 'Construtores',
    timestamps: false
})

module.exports = { Construtor }
