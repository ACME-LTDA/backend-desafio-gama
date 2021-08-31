const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./config_sequelize')

// "season": "1950",
// "url": "https:\/\/en.wikipedia.org\/wiki\/1950_Formula_One_season"

const Temporada = sequelize.define('Temporada', {
    id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    urlWiki: {
        type: Sequelize.STRING(200)
    }
}, {
    tableName: 'Temporadas',
    timestamps: false
})

module.exports = { Temporada }
